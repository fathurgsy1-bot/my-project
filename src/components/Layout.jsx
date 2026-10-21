import { useEffect, useState } from 'react';
import { api } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

const ICONS = { KAS: 'bi-wallet2', KEGIATAN: 'bi-calendar3', ADMIN: 'bi-shield-lock-fill', TUNGGAKAN: 'bi-exclamation-triangle-fill', WARGA: 'bi-people-fill', NOTULEN: 'bi-journal-text', PENGURUS: 'bi-person-badge-fill', SURAT: 'bi-envelope-paper-fill', INVENTARIS: 'bi-box-seam-fill' };
const GROUP = { KAS: 'k', TUNGGAKAN: 'k', ADMIN: 's' };

export default function Layout({ page, onNavigate, children }) {
  const { session, signOut } = useAuth();
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { api.getMenus().then(setMenus).catch(() => setMenus([])); }, []);

  const go = (p) => { onNavigate(p); setOpen(false); };
  const by = (g) => menus.filter((n) => (GROUP[n.toUpperCase()] || 'a') === g);
  const item = (name) => (
    <div key={name} className={`menu-item ${page.name === name ? 'active' : ''}`} onClick={() => go({ type: 'sheet', name })}>
      <i className={`bi ${ICONS[name.toUpperCase()] || 'bi-file-earmark-text'}`} />
      {name.toUpperCase() === 'ADMIN' ? 'Kelola Akun' : `Data ${name}`}
    </div>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand p-4 fw-bold fs-5 border-bottom"><i className="bi bi-building me-2" />RT.04 RW.26</div>
        <div className="menu-label">Navigasi Utama</div>
        <div className={`menu-item ${page.type === 'dashboard' ? 'active' : ''}`} onClick={() => go({ type: 'dashboard' })}>
          <i className="bi bi-grid-1x2-fill" /> Dashboard Utama
        </div>
        <div className="menu-label">Keuangan</div>{by('k').map(item)}
        <div className="menu-label">Administrasi</div>{by('a').map(item)}
        {by('s').length > 0 && <><div className="menu-label">Pengaturan</div>{by('s').map(item)}</>}
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-lg-none border" onClick={() => setOpen(!open)}><i className="bi bi-list" /></button>
            <h5 className="m-0 fw-bold d-none d-sm-block">{page.type === 'dashboard' ? 'Dashboard Utama' : `Data ${page.name}`}</h5>
            <span className="badge bg-success rounded-pill px-3 text-uppercase">{session.role}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted d-none d-md-block">Halo, <b className="text-capitalize">{session.username}</b>!</span>
            <button className="btn btn-danger btn-sm rounded-circle" style={{ width: 40, height: 40 }} onClick={signOut}><i className="bi bi-box-arrow-right" /></button>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

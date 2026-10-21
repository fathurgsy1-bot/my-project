import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { cleanNumber, formatRupiah } from '../utils/format';
import RowFormModal from '../components/RowFormModal';

// Halaman generik: KAS, WARGA, KEGIATAN, NOTULEN, PENGURUS, SURAT, INVENTARIS, ADMIN
export default function SheetPage({ name }) {
  const { canCrud } = useAuth();
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {mode,row}
  const isKas = name.toUpperCase() === 'KAS';
  const crud = canCrud(name);

  const load = useCallback(() => {
    setLoading(true);
    api.getSheet(name).then(setData).finally(() => setLoading(false));
  }, [name]);
  useEffect(load, [load]);

  const hidden = useMemo(() => data.headers.map((h) => ['created', 'waktu', 'base'].includes(h.toLowerCase().trim())), [data.headers]);
  const kas = useMemo(() => {
    if (!isKas) return null;
    const d = data.headers.findIndex((h) => /debet|pemasukan|masuk/i.test(h));
    const k = data.headers.findIndex((h) => /kredit|pengeluaran|keluar/i.test(h));
    const masuk = data.rows.reduce((s, r) => s + cleanNumber(r.data[d]), 0);
    const keluar = data.rows.reduce((s, r) => s + cleanNumber(r.data[k]), 0);
    return { masuk, keluar, saldo: masuk - keluar, d, k };
  }, [isKas, data]);

  const save = async (rowData) => {
    try {
      modal.mode === 'add' ? await api.addRow(name, rowData) : await api.editRow(name, modal.row.id, rowData);
      setModal(null); load();
    } catch (e) { Swal.fire('Gagal', e.message, 'error'); }
  };

  const remove = async (id) => {
    const r = await Swal.fire({ title: 'Hapus Data?', text: 'Tindakan ini permanen!', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!' });
    if (r.isConfirmed) { await api.deleteRow(name, id); load(); }
  };

  return (
    <>
      {kas && (
        <div className="row g-3 mb-4">
          <div className="col-12"><div className="hero p-4"><small className="text-uppercase">Total Saldo Kas</small><h2 className="mono fw-bold m-0">{formatRupiah(kas.saldo)}</h2></div></div>
          <div className="col-6"><div className="card-c p-3"><small className="text-muted">PEMASUKAN</small><h5 className="mono text-success m-0">{formatRupiah(kas.masuk)}</h5></div></div>
          <div className="col-6"><div className="card-c p-3"><small className="text-muted">PENGELUARAN</small><h5 className="mono text-danger m-0">{formatRupiah(kas.keluar)}</h5></div></div>
        </div>
      )}
      <div className="card-c overflow-hidden">
        <div className="p-4 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="fw-bold m-0">Manajemen Konten {name}</h5>
          {crud && <button className="btn btn-grad btn-sm rounded-pill px-3" onClick={() => setModal({ mode: 'add' })}><i className="bi bi-plus-lg me-1" />Data Baru</button>}
        </div>
        <div className="table-responsive">
          {loading ? <div className="p-4 text-center text-muted">Mengunduh data...</div> : data.rows.length === 0 ? <div className="p-4 text-center text-muted">Belum ada data.</div> : (
            <table className="table tbl text-nowrap m-0">
              <thead><tr>{data.headers.map((h, i) => !hidden[i] && <th key={h}>{h}</th>)}<th className="text-center">AKSI</th></tr></thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id}>
                    {r.data.map((c, i) => !hidden[i] && (
                      <td key={i}>
                        {isKas && (i === kas.d || i === kas.k) ? (cleanNumber(c) ? formatRupiah(cleanNumber(c)) : '-')
                          : /nominal/i.test(data.headers[i]) ? <b className="text-success">{formatRupiah(cleanNumber(c))}</b>
                          : /password/i.test(data.headers[i]) ? '••••••••'
                          : /^https?:\/\//.test(c) ? <a href={c} target="_blank" rel="noreferrer">Buka</a>
                          : String(c ?? '').length > 50 ? String(c).slice(0, 50) + '…' : c}
                      </td>
                    ))}
                    <td className="text-center">
                      <button className="btn btn-light border btn-sm me-1" onClick={() => setModal({ mode: 'detail', row: r })}><i className="bi bi-eye-fill text-info" /></button>
                      {crud && <>
                        <button className="btn btn-light border btn-sm me-1" onClick={() => setModal({ mode: 'edit', row: r })}><i className="bi bi-pencil-fill text-warning" /></button>
                        <button className="btn btn-light border btn-sm" onClick={() => remove(r.id)}><i className="bi bi-trash-fill text-danger" /></button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal && <RowFormModal mode={modal.mode} sheet={name} headers={data.headers} row={modal.row} onClose={() => setModal(null)} onSubmit={save} />}
    </>
  );
}

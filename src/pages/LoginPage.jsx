import { useState } from 'react';
import Swal from 'sweetalert2';
import { api } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (register) {
        const res = await api.register(form.username, form.password);
        Swal.fire('Berhasil', res.message || 'Akun dibuat, silakan login.', 'success');
        setRegister(false);
      } else signIn(await api.login(form.username, form.password));
    } catch (err) { Swal.fire('Gagal', err.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card text-center" onSubmit={submit}>
        <i className="bi bi-houses-fill" style={{ fontSize: '3.5rem', color: 'var(--primary)' }} />
        <h3 className="fw-bold mt-2">{register ? 'Daftar Warga' : 'Portal RT04/RW26'}</h3>
        <p className="text-muted small">Sistem Pemantauan Administrasi & Keuangan</p>
        <input className="form-control form-control-lg fs-6 mb-3" placeholder="Username" value={form.username} onChange={set('username')} required />
        <input className="form-control form-control-lg fs-6 mb-4" type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
        <button className="btn btn-grad w-100 py-3 fw-bold rounded-pill" disabled={loading}>{register ? 'Buat Akun' : 'Masuk Dashboard'}</button>
        <div className="mt-3 small fw-semibold" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setRegister(!register)}>
          {register ? 'Kembali ke Login.' : 'Belum punya akun? Daftar.'}
        </div>
      </form>
    </div>
  );
}

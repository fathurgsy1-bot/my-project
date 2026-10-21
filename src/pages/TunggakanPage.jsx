import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from '../api/endpoints';
import { BULAN, BULAN_ABBR, cleanNumber, formatRibuan, formatRupiah, stripRibuan } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export default function TunggakanPage() {
  const { canCrud } = useAuth();
  const [rows, setRows] = useState([]);
  const [pay, setPay] = useState(null);
  const [printRows, setPrintRows] = useState(null);
  const tahun = new Date().getFullYear();
  const load = () => api.getRekapTunggakan().then((r) => setRows(r.rows));
  useEffect(() => { load(); }, []);

  const total = rows.reduce((s, r) => s + cleanNumber(r.data[2]), 0);
  const cetak = (list) => { setPrintRows(list); setTimeout(() => { window.print(); setPrintRows(null); }, 200); };

  const submitPay = async () => {
    try {
      const res = await api.payKas({ name: pay.nama, month: pay.bulan, year: pay.tahun, amount: stripRibuan(pay.jumlah), note: pay.note });
      Swal.fire('Berhasil!', res.message, 'success'); setPay(null); load();
    } catch (e) { Swal.fire('Gagal', e.message, 'error'); }
  };

  return (
    <>
      <div className="hero red p-4 mb-4"><small className="text-uppercase">Total Keseluruhan Tunggakan</small><h2 className="mono fw-bold m-0">{formatRupiah(total)}</h2></div>
      <div className="card-c overflow-hidden">
        <div className="p-4 d-flex justify-content-between border-bottom">
          <h5 className="fw-bold m-0">Rekap Tunggakan</h5>
          <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => cetak(rows)}><i className="bi bi-printer me-1" />Cetak Laporan Semua Warga</button>
        </div>
        <div className="table-responsive"><table className="table tbl m-0">
          <thead><tr><th>Nama</th><th>Total</th><th>Rincian</th><th className="text-center">Aksi</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td>{r.data[1]}</td>
              <td className={cleanNumber(r.data[2]) > 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>{formatRupiah(cleanNumber(r.data[2]))}</td>
              <td>{r.data[3]}</td>
              <td className="text-center text-nowrap">
                <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => cetak([r])}><i className="bi bi-printer" /></button>
                {canCrud('TUNGGAKAN') && <button className="btn btn-success btn-sm" onClick={() => setPay({ nama: r.data[1], tunggakan: cleanNumber(r.data[2]), bulan: BULAN[new Date().getMonth()], tahun, jumlah: '', note: '' })}><i className="bi bi-cash" /> Bayar</button>}
              </td>
            </tr>))}</tbody>
        </table></div>
      </div>

      {pay && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.4)' }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content" style={{ borderRadius: 20 }}>
            <div className="modal-header"><h5 className="modal-title fw-bold">Bayar Iuran Warga</h5><button className="btn-close" onClick={() => setPay(null)} /></div>
            <div className="modal-body">
              <input className="form-control fw-bold mb-3" readOnly value={pay.nama} />
              <div className={`p-3 rounded border mb-3 ${pay.tunggakan > 0 ? 'border-danger text-danger' : 'border-success text-success'}`}>
                {pay.tunggakan > 0 ? <>Tagihan: <b className="mono">{formatRupiah(pay.tunggakan)}</b></> : 'Warga bersih dari tunggakan'}
              </div>
              <div className="row mb-3">
                <div className="col-6"><select className="form-select" value={pay.bulan} onChange={(e) => setPay({ ...pay, bulan: e.target.value })}>{BULAN.map((b) => <option key={b}>{b}</option>)}</select></div>
                <div className="col-6"><select className="form-select" value={pay.tahun} onChange={(e) => setPay({ ...pay, tahun: e.target.value })}>{[-1, 0, 1, 2].map((i) => <option key={i}>{tahun - i}</option>)}</select></div>
              </div>
              <input className="form-control fw-bold mb-3" inputMode="numeric" placeholder="Nominal (Rp)" value={pay.jumlah} onChange={(e) => setPay({ ...pay, jumlah: formatRibuan(e.target.value) })} />
              <textarea className="form-control" rows={2} placeholder="Catatan..." value={pay.note} onChange={(e) => setPay({ ...pay, note: e.target.value })} />
            </div>
            <div className="modal-footer"><button className="btn btn-grad w-100 py-2 fw-bold" onClick={submitPay}>Konfirmasi Bayar</button></div>
          </div></div>
        </div>
      )}

      {printRows && (
        <div className="print-only p-4">
          <h5 className="text-center fw-bold">LAPORAN PENERIMAAN PEMBAYARAN IURAN WARGA RT 04/RW 026 — {tahun}</h5>
          <table className="ledger mt-3">
            <thead><tr><th>No</th><th>Nama</th>{BULAN_ABBR.map((b) => <th key={b}>{b}-{String(tahun).slice(-2)}</th>)}</tr></thead>
            <tbody>{printRows.map((r, i) => {
              const belum = String(r.data[3] || '').split(',').map((s) => s.trim());
              return <tr key={r.id}><td>{i + 1}</td><td style={{ textAlign: 'left' }}>{r.data[1]}</td>
                {BULAN.map((b) => <td key={b} className={belum.includes(b) ? 'belum' : ''}>{belum.includes(b) ? '✗' : ''}</td>)}</tr>;
            })}</tbody>
          </table>
          <p className="mt-2 fst-italic" style={{ fontSize: 11 }}>Ket: ✗ = belum dibayar. Kolom kosong = lunas.</p>
        </div>
      )}
    </>
  );
}

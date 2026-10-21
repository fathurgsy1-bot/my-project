import { useState } from 'react';
import { formatRibuan, stripRibuan, BULAN } from '../utils/format';

const AUTO = (h) => /^(no|nomor)$/.test(h.toLowerCase().replace(/[^a-z]/g, '')) || /created|waktu|tanggal/i.test(h);

// Form generik (add/edit/detail). Khusus KAS: tab Masuk/Keluar.
export default function RowFormModal({ mode, sheet, headers, row, onClose, onSubmit }) {
  const isKas = sheet.toUpperCase() === 'KAS';
  const ro = mode === 'detail';
  const [vals, setVals] = useState(() => headers.map((_, i) => row?.data[i] ?? ''));
  const [kas, setKas] = useState(() => {
    const find = (re) => headers.findIndex((h) => re.test(h.toLowerCase()));
    const d = find(/debet|pemasukan|masuk/), k = find(/kredit|pengeluaran|keluar/);
    const dv = Number(String(row?.data[d] ?? 0).replace(/\D/g, '')), kv = Number(String(row?.data[k] ?? 0).replace(/\D/g, ''));
    return {
      type: kv > 0 ? 'keluar' : 'masuk', nominal: formatRibuan(kv || dv),
      ket: row?.data[find(/keterangan|uraian/)] ?? '', bulan: row?.data[find(/bulan/)] || BULAN[new Date().getMonth()],
    };
  });

  const submit = () => {
    if (!isKas) return onSubmit(headers.map((h, i) => (/nominal/i.test(h) ? stripRibuan(vals[i]) : vals[i])));
    const n = stripRibuan(kas.nominal), masuk = kas.type === 'masuk';
    onSubmit(headers.map((h) => {
      const l = h.toLowerCase().replace(/[^a-z]/g, '');
      if (/keterangan|uraian/.test(l)) return kas.ket;
      if (l.includes('bulan')) return kas.bulan;
      if (/debet|pemasukan|masuk/.test(l)) return masuk ? n : 0;
      if (/kredit|pengeluaran|keluar/.test(l)) return masuk ? 0 : n;
      return '';
    }));
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,.4)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: 20 }}>
          <div className="modal-header"><h5 className="modal-title fw-bold">{{ add: 'Tambah Baru', edit: 'Edit Data', detail: 'Detail Data' }[mode]}</h5><button className="btn-close" onClick={onClose} /></div>
          <div className="modal-body">
            {isKas ? (
              <>
                <div className="d-flex gap-2 mb-3">
                  {['masuk', 'keluar'].map((t) => (
                    <button key={t} disabled={ro} className={`btn flex-fill ${kas.type === t ? 'btn-grad' : 'btn-light'}`} onClick={() => setKas({ ...kas, type: t })}>{t === 'masuk' ? 'Masuk 📈' : 'Keluar 📉'}</button>
                  ))}
                </div>
                <label className="form-label small fw-bold">Uraian</label>
                <input className="form-control mb-3" readOnly={ro} value={kas.ket} onChange={(e) => setKas({ ...kas, ket: e.target.value })} />
                <label className="form-label small fw-bold">Bulan</label>
                <select className="form-select mb-3" disabled={ro} value={kas.bulan} onChange={(e) => setKas({ ...kas, bulan: e.target.value })}>{BULAN.map((b) => <option key={b}>{b}</option>)}</select>
                <label className="form-label small fw-bold">Jumlah (Rp)</label>
                <input className="form-control" inputMode="numeric" readOnly={ro} value={kas.nominal} onChange={(e) => setKas({ ...kas, nominal: formatRibuan(e.target.value) })} />
              </>
            ) : headers.map((h, i) => (ro || !AUTO(h)) && (
              <div className="mb-3" key={h}>
                <label className="form-label small fw-bold">{h}</label>
                <input className="form-control" readOnly={ro} value={/nominal/i.test(h) ? formatRibuan(vals[i]) : vals[i]}
                  onChange={(e) => setVals(vals.map((v, j) => (j === i ? e.target.value : v)))} />
              </div>
            ))}
          </div>
          {!ro && <div className="modal-footer"><button className="btn btn-light" onClick={onClose}>Tutup</button><button className="btn btn-grad px-4" onClick={submit}>Simpan Data</button></div>}
        </div>
      </div>
    </div>
  );
}

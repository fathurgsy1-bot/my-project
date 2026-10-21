import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { api } from '../api/endpoints';
import { formatRupiah } from '../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const HIDDEN = ['KK', 'TUNGGAKAN', 'ANGSURAN'];
const opt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

export default function DashboardPage({ onOpen }) {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    api.getDashboardSummary().then(setSummary);
    api.getDashboardCharts().then(setCharts);
  }, []);

  if (!summary) return <div className="text-center text-muted p-5"><span className="spinner-border spinner-border-sm me-2" />Menyusun ringkasan...</div>;

  return (
    <>
      <div className="row g-3 mb-4">
        {summary.filter((i) => !HIDDEN.includes(i.name.toUpperCase())).map((i) => (
          <div key={i.name} className="col-6 col-md-4 col-lg-3" onClick={() => onOpen(i.name)}>
            <div className="card-c widget p-3 h-100">
              <h6 className="text-muted text-uppercase fw-bold small text-truncate">{i.name}</h6>
              <h3 className="fw-bold m-0">{i.count} <span className="text-muted fs-6 fw-normal">Baris</span></h3>
              {i.name.toUpperCase() === 'KAS' && (
                <div className="small text-muted border-top pt-2 mt-2">
                  <div>Kas: <b className="text-success">{formatRupiah(i.kasSekarang)}</b></div>
                  <div>Tunggakan: <b className="text-danger">{formatRupiah(i.totalTunggakan)}</b></div>
                </div>
              )}
              {i.name.toUpperCase() === 'WARGA' && (
                <div className="small mt-2 d-flex flex-wrap gap-1">
                  <span className="badge bg-primary">L: {i.laki || 0}</span><span className="badge bg-danger">P: {i.perempuan || 0}</span>
                  <span className="badge bg-success">Anak: {i.anak || 0}</span><span className="badge bg-secondary">Ortu: {i.orangtua || 0}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {charts && (
        <div className="row g-3">
          <div className="col-lg-7"><div className="card-c p-3" style={{ height: 300 }}>
            <Bar options={opt} data={{ labels: charts.kasData.labels, datasets: [
              { label: 'Uang Masuk', data: charts.kasData.masuk, backgroundColor: '#6d5bf6', borderRadius: 6 },
              { label: 'Uang Keluar', data: charts.kasData.keluar, backgroundColor: '#fb4570', borderRadius: 6 }] }} />
          </div></div>
          <div className="col-lg-5"><div className="card-c p-3" style={{ height: 300 }}>
            <Doughnut options={opt} data={{ labels: charts.sheetStats.labels, datasets: [{ data: charts.sheetStats.data, backgroundColor: ['#6d5bf6', '#8b5cf6', '#ff6ea8', '#17c3ec', '#16c79a', '#a48bff'] }] }} />
          </div></div>
        </div>
      )}
    </>
  );
}

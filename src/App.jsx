import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SheetPage from './pages/SheetPage';
import TunggakanPage from './pages/TunggakanPage';

export default function App() {
  const { session } = useAuth();
  const [page, setPage] = useState({ type: 'dashboard' }); // {type:'dashboard'} | {type:'sheet', name}
  if (!session) return <LoginPage />;

  let view;
  if (page.type === 'dashboard') view = <DashboardPage onOpen={(name) => setPage({ type: 'sheet', name })} />;
  else if (page.name.toUpperCase() === 'TUNGGAKAN') view = <TunggakanPage />;
  else view = <SheetPage key={page.name} name={page.name} />;
  // TODO: halaman QR Warga, Kartu Warga, Generator Undangan, Scan KK (lihat README)

  return (
    <Layout page={page} onNavigate={setPage}>{view}</Layout>
  );
}

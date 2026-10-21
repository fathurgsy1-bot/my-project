export const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export const BULAN_ABBR = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

export const cleanNumber = (v) => parseFloat(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0;
export const formatRupiah = (v) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');
export const formatRibuan = (raw) => {
  const d = String(raw).replace(/\D/g, '');
  return d ? Number(d).toLocaleString('id-ID') : '';
};
export const stripRibuan = (s) => Number(String(s ?? '').replace(/\./g, '').replace(/[^0-9-]/g, '')) || 0;

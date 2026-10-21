# RT04/RW26 — Web Dashboard (React)

Frontend React (Vite) untuk Sistem Informasi RT04/RW26. Pengganti UI Google Apps Script;
backend: **Go + PostgreSQL** (repo `rt04rw26-go`).

## Menjalankan
```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173 (proxy /api -> localhost:8080)
npm run build
```

## Struktur
```
src/
├── api/         client.js (fetch + JWT), endpoints.js (pengganti google.script.run)
├── context/     AuthContext (session, role, canCrud)
├── components/  Layout (sidebar/topbar), RowFormModal (form add/edit/detail + KAS)
├── pages/       Login, Dashboard (+chart), SheetPage (CRUD generik), Tunggakan (bayar + cetak ledger)
├── utils/       format.js (rupiah, bulan)
└── styles/      theme.css
```

## Kontrak API yang diharapkan
Lihat `src/api/endpoints.js`. Respons utama:
- `POST /api/auth/login` → `{token, username, role}`
- `GET /api/sheets/:name` → `{headers: [...], rows: [{id, data: [...]}]}`
- `GET /api/tunggakan` → format sama; `data[1]`=nama, `[2]`=total, `[3]`=rincian bulan
- `GET /api/dashboard/summary` → `[{name,count,kasSekarang?,totalTunggakan?,laki?,perempuan?,anak?,orangtua?}]`
- `GET /api/dashboard/charts` → `{kasData:{labels,masuk,keluar}, sheetStats:{labels,data}}`

## Belum dimigrasi (dari file HTML asli)
Modul berikut masih perlu dipindah sebagai halaman baru di `src/pages/`:
Generator QR Warga, Cetak Kartu Warga (html2canvas + JSZip), Generator Undangan,
Scan KK (Tesseract.js), form khusus Notulen (Quill) / Kegiatan / Inventaris + label barcode (JsBarcode),
dan Laporan bulanan + ekspor gambar. Endpoint-nya sudah disiapkan di `endpoints.js`.

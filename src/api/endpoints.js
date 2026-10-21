import { request as r } from './client';

// Pengganti google.script.run.* — sesuaikan route dengan backend Go
export const api = {
  login: (username, password) => r('/auth/login', { method: 'POST', body: { username, password } }),
  register: (username, password) => r('/auth/register', { method: 'POST', body: { username, password } }),

  getMenus: () => r('/menus'),                                  // getSheetNames
  getDashboardSummary: () => r('/dashboard/summary'),           // getDashboardSummary
  getDashboardCharts: () => r('/dashboard/charts'),             // getDashboardDataForCharts

  getSheet: (name) => r(`/sheets/${name}`),                     // getSheetData -> {headers, rows:[{id,data}]}
  addRow: (name, data) => r(`/sheets/${name}`, { method: 'POST', body: { data } }),
  editRow: (name, id, data) => r(`/sheets/${name}/${id}`, { method: 'PUT', body: { data } }),
  deleteRow: (name, id) => r(`/sheets/${name}/${id}`, { method: 'DELETE' }),

  getRekapTunggakan: () => r('/tunggakan'),                     // getRekapTunggakan
  payKas: (payload) => r('/kas/pay', { method: 'POST', body: payload }), // submitKas

  addInventaris: (p) => r('/inventaris', { method: 'POST', body: p }),
  editInventaris: (id, p) => r(`/inventaris/${id}`, { method: 'PUT', body: p }),

  getWargaList: () => r('/warga/tunggakan'),
  saveWargaBatch: (items) => r('/warga/batch', { method: 'POST', body: { items } }),
  generateQR: (id) => r(`/warga/${id}/qr`, { method: 'POST' }),
  generateQRBulk: () => r('/warga/qr/bulk', { method: 'POST' }),
};

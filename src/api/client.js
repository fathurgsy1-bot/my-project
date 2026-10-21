const BASE = import.meta.env.VITE_API_URL || '';


export async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('rtrw_token');
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

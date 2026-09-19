const API_BASE = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.msg || 'Request failed');
  return data;
}

export const api = {
  register: (email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  saveKey: (exchange, apiKey, apiSecret) =>
    request('/keys', {
      method: 'POST',
      body: JSON.stringify({ exchange, apiKey, apiSecret }),
    }),
  getKeyStatus: () => request('/keys/status'),
  getPrice: () => request('/price'),
};

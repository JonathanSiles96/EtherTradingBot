const API_BASE = '/api';

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

  getHistory: (limit = 50) => request(`/history?limit=${limit}`),
  getStats: () => request('/history/stats'),

  getBalance: () => request('/trade/balance'),
  getOrders: () => request('/trade/orders'),
  placeBuy: (amount, price) =>
    request('/trade/buy', {
      method: 'POST',
      body: JSON.stringify({ amount, price }),
    }),
  placeSell: (amount, price) =>
    request('/trade/sell', {
      method: 'POST',
      body: JSON.stringify({ amount, price }),
    }),
  cancelOrder: (orderId) =>
    request(`/trade/orders/${orderId}`, { method: 'DELETE' }),

  getAlerts: () => request('/alerts'),
  createAlert: (type, targetPrice) =>
    request('/alerts', {
      method: 'POST',
      body: JSON.stringify({ type, targetPrice }),
    }),
  removeAlert: (alertId) =>
    request(`/alerts/${alertId}`, { method: 'DELETE' }),

  getTransactions: (address, page = 1) =>
    request(`/transactions/${address}?page=${page}`),
};

// Notre backend : login STT, listes de test et détail des notifications STT (proxy).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.11.15:7050';

class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.error_description || payload?.error || `Erreur HTTP ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

async function request(baseUrl, path, { method = 'GET', body, token, headers } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }
  return payload;
}

export const api = {
  sttLogin: (username, password) =>
    request(BASE_URL, '/stt/token', { method: 'POST', body: { username, password } }),
  getProfile: (token) => request(BASE_URL, '/api/profile/', { token }),

  listAccounts: () => request(BASE_URL, '/api/test/accounts/'),
  listPayments: (token) => request(BASE_URL, '/api/test/payments/', { token }),

  getAccountDetail: (transactionId, token) =>
    request(BASE_URL, `/stt/notificationstt/ACCOUNT/${encodeURIComponent(transactionId)}`, { token }),
  getPaymentDetail: (transactionId, token) =>
    request(BASE_URL, `/stt/notificationstt/PAYMENT/${encodeURIComponent(transactionId)}`, { token }),

  processPayment: (transactionId, token) =>
    request(BASE_URL, `/api/payments/${encodeURIComponent(transactionId)}/process/`, { method: 'POST', token }),

  listArchivedPayments: (token) => request(BASE_URL, '/api/payments/archive/', { token }),
  getArchivedPaymentDetail: (transactionId, token) =>
    request(BASE_URL, `/api/payments/archive/${encodeURIComponent(transactionId)}/`, { token }),
};

export { ApiError, BASE_URL };

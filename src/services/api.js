import { API_URL, API_KEY } from '../config';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  return res.json();
}

export function getLatestReadings(limit = 1) {
  return request(`/readings?limit=${limit}`);
}

export function getAllReadings(limit = 100) {
  return request(`/readings?limit=${limit}`);
}

export function getStats() {
  return request('/readings/stats');
}
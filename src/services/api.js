import { API_URL, API_KEY } from '../config';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s máximo

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
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
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Tiempo de espera agotado — revisa tu conexión');
    throw e;
  } finally {
    clearTimeout(timeout);
  }
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
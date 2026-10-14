import axios from 'axios';
import { mockAdapter } from './mockAdapter';

// ── Use mock data when VITE_MOCK_API=true OR no real API URL is configured ──
const useMock =
  import.meta.env.VITE_MOCK_API === 'true' ||
  !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
  ...(useMock ? { adapter: mockAdapter } : {}),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('florglass_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('florglass_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

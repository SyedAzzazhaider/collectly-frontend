import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error('[Collectly] VITE_API_BASE_URL is not defined. Check .env file.');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // required — backend refresh token is httpOnly cookie
  timeout: 15000,
});

// ── In-memory token store (never localStorage — XSS prevention) ──────────
let _accessToken = null;

export const getAccessToken  = ()        => _accessToken;
export const setAccessToken  = (token)   => { _accessToken = token; };
export const clearAccessToken = ()       => { _accessToken = null; };

// ── Request interceptor — attach Bearer token ────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — auto-refresh on TOKEN_EXPIRED ─────────────────
let isRefreshing   = false;
let failedQueue    = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isExpired =
      error.response?.status === 401 &&
      (error.response?.data?.code === 'TOKEN_EXPIRED' ||
       error.response?.data?.code === 'INVALID_TOKEN') &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login');

    if (!isExpired) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(original);
        });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      const res      = await axiosInstance.post('/auth/refresh');
      const newToken = res.data?.data?.accessToken;

      if (!newToken) throw new Error('No token in refresh response');

      setAccessToken(newToken);
      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAccessToken();
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
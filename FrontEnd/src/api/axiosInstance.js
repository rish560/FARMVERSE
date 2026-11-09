import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 12000, // fail fast instead of hanging the page on a slow/dead request
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization && typeof window !== 'undefined') {
      const stored = localStorage.getItem('farmverse-auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        } catch {}
      }
    }
    if (config.url && config.url.startsWith('/api/') && (config.baseURL || axiosInstance.defaults.baseURL).endsWith('/api')) {
      config.url = config.url.replace(/^\/api/, '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default axiosInstance;
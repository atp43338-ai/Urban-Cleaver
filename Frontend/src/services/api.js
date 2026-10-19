import axios from 'axios';

// Normalize base URL to prevent double slashes or undefined errors
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Inject Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('urban_cleaver_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Extract error messages uniformly and log network diagnostics
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      url: error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'Unknown',
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error('[API Response Error Diagnostic]', errorDetails);

    // If token expired or unauthorized, optionally clear stored session
    if (error.response?.status === 401) {
      const currentToken = localStorage.getItem('urban_cleaver_token');
      if (currentToken && error.config && !error.config.url.includes('/login')) {
        localStorage.removeItem('urban_cleaver_token');
        localStorage.removeItem('urban_cleaver_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

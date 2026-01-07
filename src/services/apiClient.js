import axios from 'axios';
import { getCSRFToken, apiRateLimiter, sanitizeInput, detectMaliciousInput } from '../utils/security';

const apiClient = axios.create({
  // Fallback to local backend in dev to avoid wrong relative /api when VITE_API_BASE_URL is missing
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token
    if (config.method !== 'get') {
      config.headers['X-CSRF-Token'] = getCSRFToken();
    }

    // Rate limiting
    const requestKey = `${config.method}:${config.url}`;
    if (!apiRateLimiter.isAllowed(requestKey)) {
      return Promise.reject({
        response: {
          status: 429,
          data: { message: 'Твърде много заявки. Моля изчакайте.' }
        }
      });
    }

    // Sanitize data
    if (config.data && typeof config.data === 'object') {
      const sanitizedData = {};
      for (const [key, value] of Object.entries(config.data)) {
        if (typeof value === 'string') {
          if (detectMaliciousInput(value)) {
            return Promise.reject({
              response: {
                status: 400,
                data: { message: 'Невалидни данни.' }
              }
            });
          }
          sanitizedData[key] = sanitizeInput(value);
        } else {
          sanitizedData[key] = value;
        }
      }
      config.data = sanitizedData;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('csrf_token');
      localStorage.removeItem('mockAuthSession');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

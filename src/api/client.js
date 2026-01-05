import axios from "axios";
import { getCSRFToken, apiRateLimiter, sanitizeInput, detectMaliciousInput } from "../utils/security";

const rawBaseUrl =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "";
const baseURL = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "";

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor for adding security headers
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token to all non-GET requests
    if (config.method !== 'get') {
      config.headers['X-CSRF-Token'] = getCSRFToken();
    }

    // Check rate limiting
    const requestKey = `${config.method}:${config.url}`;
    if (!apiRateLimiter.isAllowed(requestKey)) {
      return Promise.reject({
        response: {
          status: 429,
          data: { message: 'Твърде много заявки. Моля изчакайте.' }
        }
      });
    }

    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      const sanitizedData = {};
      for (const [key, value] of Object.entries(config.data)) {
        if (typeof value === 'string') {
          // Check for malicious input
          if (detectMaliciousInput(value)) {
            console.warn('Malicious input detected and blocked:', key);
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

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      sessionStorage.removeItem('csrf_token');
      localStorage.removeItem('mockAuthSession');
    }

    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded');
    }

    return Promise.reject(error);
  }
);

export const get = (url, config = {}) => apiClient.get(url, config);

export const post = (url, data, config = {}) => apiClient.post(url, data, config);

export default apiClient;

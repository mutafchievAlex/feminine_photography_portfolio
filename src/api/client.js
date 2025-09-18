import axios from "axios";

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
});

export const get = (url, config = {}) => apiClient.get(url, config);

export const post = (url, data, config = {}) => apiClient.post(url, data, config);

export default apiClient;

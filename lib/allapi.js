
import axios from "axios";
// Prefer public env var; fall back to existing production URL
const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.PROD_API_URL || "https://9nutsapi.nearbydoctors.in/public/api/").replace(/\/+$/, "");

const apiAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiAxios;
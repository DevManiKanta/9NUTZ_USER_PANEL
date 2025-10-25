
import axios from "axios"
// const BASE_URL_1 =process.env.LOCAL_API_URL || "http://192.168.29.100:8000/api/";
const BASE_URL_2 =process.env.PROD_API_URL || "https://9nutsapi.nearbydoctors.in/public/api/"; 
const apiAxios = axios.create({
  baseURL: BASE_URL_2,
  headers: {
    "Content-Type": "application/json",
  },
});
apiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiAxios;
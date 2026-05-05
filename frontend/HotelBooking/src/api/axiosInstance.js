import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7085/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Đính kèm token vào mọi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi tập trung
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // ✅ TRẢ LẠI NGUYÊN ERROR
    return Promise.reject(err);
  },
);

export default axiosInstance;

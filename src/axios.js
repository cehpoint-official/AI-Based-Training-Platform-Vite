import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://api-kdpffzlvkq-uc.a.run.app",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      config.headers.authToken = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

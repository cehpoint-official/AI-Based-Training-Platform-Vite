import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://api-kdpffzlvkq-uc.a.run.app",
});

export default axiosInstance;

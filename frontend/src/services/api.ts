import axios from "axios";
import { useAuthStore } from "../store/auth.store"; // Import để lấy token (không dùng hook, dùng getState)

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor add Authorization header
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token; // Lấy token từ store (getState để không dùng hook)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor log lỗi response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error Details:", {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            responseData: error.response?.data,
            status: error.response?.status,
            message: error.message,
        });
        return Promise.reject(error);
    }
);

export default api;
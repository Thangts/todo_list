// frontend/src/services/taskService.ts
import axios from "./api";
import { getAuthStore } from "../store/auth.store";
import { Task } from "../types/task";

// interceptor thêm token
axios.interceptors.request.use((config) => {
    const token = getAuthStore().token; // ✅ dùng helper
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as any;
    }
    return config;
});

// CRUD task
export const getTasks = async (): Promise<Task[]> => {
    const res = await axios.get("/tasks");
    return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const res = await axios.post("/tasks", task);
    return res.data;
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
    const res = await axios.put(`/tasks/${id}`, updates);
    return res.data;
};

export const deleteTask = async (id: number): Promise<boolean> => {
    const res = await axios.delete(`/tasks/${id}`);
    return res.status >= 200 && res.status < 300;
};
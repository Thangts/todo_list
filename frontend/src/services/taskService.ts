// frontend/src/services/taskService.ts
import api from "./api";
import { Task } from "../types/task";

export const getTasks = async (): Promise<Task[]> => {
    const res = await api.get<Task[]>("/tasks");
    return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const res = await api.post<Task>("/tasks", task);
    return res.data;
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
    const res = await api.put<Task>(`/tasks/${id}`, updates);
    return res.data;
};

export const deleteTask = async (id: number): Promise<boolean> => {
    await api.delete(`/tasks/${id}`);
    return true;
};

// 👇 order không bắt buộc nữa
export const updateTaskStatus = async (
    id: number,
    status: Task["status"],
    order?: number
): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${id}/status`, { status, order });
    return res.data;
};

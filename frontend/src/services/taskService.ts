// frontend/src/services/taskService.ts
import api from "./api";
import { Task } from "../types/task";

export async function getAllTasks(): Promise<Task[]> {
  const res = await api.get("/api/tasks");
  return res.data;
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at" | "completed_at">): Promise<Task> {
  const res = await api.post("/api/tasks", task);
  return res.data;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
  const res = await api.put(`/api/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}
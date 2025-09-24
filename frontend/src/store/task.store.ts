// frontend/src/store/task.store.ts
import { create } from "zustand";
import { Task } from "../types/task";
import * as api from "../services/taskService";

interface TaskState {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  replaceAll: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  fetchTasks: async () => {
    const tasks = await api.getAllTasks();
    set({ tasks });
  },
  addTask: async (task) => {
    const created = await api.createTask(task);
    set({ tasks: [...get().tasks, created] });
  },
  updateTask: async (id, updates) => {
    const updated = await api.updateTask(id, updates);
    set({ tasks: get().tasks.map(t => t.id === id ? updated : t) });
  },
  deleteTask: async (id) => {
    await api.deleteTask(id);
    set({ tasks: get().tasks.filter(t => t.id !== id) });
  },
  replaceAll: (tasks) => set({ tasks }),
}));

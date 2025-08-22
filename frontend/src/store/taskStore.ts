import { create } from "zustand";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { Task } from "../types/task";

interface TaskUpdate {
    id: number;
    updates: Partial<Task>;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    fetchTasks: () => Promise<void>;
    addTask: (title: string, description?: string, status?: Task["status"]) => Promise<void>;
    editTask: (id: number, updates: Partial<Task>) => Promise<void>;
    removeTask: (id: number) => Promise<void>;
    updateTaskOrder: (id: number, order: number, status: Task["status"]) => Promise<void>;
    updateTaskStatus: (id: number, status: Task["status"]) => Promise<void>;
    // ✅ Mới: cho Home.tsx
    replaceAll: (newTasks: Task[]) => void;
    bulkUpdate: (updates: TaskUpdate[]) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    loading: false,

    fetchTasks: async () => {
        set({ loading: true });
        try {
            const data = await getTasks();
            set({ tasks: data });
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            set({ loading: false });
        }
    },

    addTask: async (title, description, status = "todo") => {
        try {
            const newTask = await createTask({ title, description, status, order: get().tasks.length });
            set({ tasks: [...get().tasks, newTask] });
        } catch (err) {
            console.error("Error creating task:", err);
        }
    },

    editTask: async (id, updates) => {
        try {
            const updated = await updateTask(id, updates);
            set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
        } catch (err) {
            console.error("Error updating task:", err);
        }
    },

    removeTask: async (id) => {
        try {
            const ok = await deleteTask(id);
            if (ok) {
                set({ tasks: get().tasks.filter((t) => t.id !== id) });
            }
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    },

    updateTaskOrder: async (id, order, status) => {
        try {
            const updated = await updateTask(id, { order, status });
            set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
        } catch (err) {
            console.error("Error updating task order:", err);
        }
    },

    updateTaskStatus: async (id, status) => {
        try {
            const updated = await updateTask(id, { status });
            set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    },

    // ✅ Method mới: thay thế toàn bộ task (UI lạc quan)
    replaceAll: (newTasks) => {
        set({ tasks: newTasks });
    },

    // ✅ Method mới: cập nhật nhiều task cùng lúc
    bulkUpdate: async (updates) => {
        try {
            await Promise.all(
                updates.map((u) => updateTask(u.id, u.updates))
            );
            set((state) => ({
                tasks: state.tasks.map((t) => {
                    const update = updates.find((u) => u.id === t.id);
                    return update ? { ...t, ...update.updates } : t;
                }),
            }));
        } catch (err) {
            console.error("Error bulk updating tasks:", err);
        }
    },
}));

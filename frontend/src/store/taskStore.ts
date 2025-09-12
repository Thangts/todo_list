// frontend/src/store/taskStore.ts
import create from "zustand";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { Task, TaskStatus } from "../types/task";

interface TaskUpdate {
  id: number;
  updates: Partial<Task>;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    deadline?: string;
  }) => Promise<void>;
  editTask: (id: number, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
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

  addTask: async ({ title, description, status = "todo", deadline }) => {
    const tasks = get().tasks;
    const colTasks = tasks.filter((t) => t.status === status);
    const order = colTasks.length + 1;

    try {
      const newTask = await createTask({ title, description, status, order, deadline });
      set({ tasks: [...tasks, newTask] });
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
    const prev = get().tasks;
    set({ tasks: prev.filter((t) => t.id !== id) }); // optimistic
    try {
      await deleteTask(id);
    } catch (err) {
      console.error("Delete failed, rolling back", err);
      set({ tasks: prev }); // rollback
    }
  },

  replaceAll: (newTasks) => {
    set({ tasks: newTasks });
  },

  bulkUpdate: async (updates) => {
    try {
      await Promise.all(updates.map((u) => updateTask(u.id, u.updates)));
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

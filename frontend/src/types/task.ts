export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Subtask {
  id: number;
  title: string;
  done: boolean;
  order: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  order: number;
  start_date?: string | null;
  due_date?: string | null;
  completed_at?: string | null;
  category?: string | null;
  priority?: TaskPriority | null;
  assignee_id?: number | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  subtasks: Subtask[];
}
//backend/src/models/Task.ts
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
    board_id?: number | null;
    title: string;
    description?: string | null;
    status: TaskStatus;
    order: number;
    start_date?: string | null;   // ISO string
    due_date?: string | null;     // ISO string
    completed_at?: string | null; // ISO string
    category?: string | null;
    priority?: TaskPriority | null;
    assignee_id?: number | null;
    created_at: string;
    updated_at: string;
    tags: string[];
    subtasks: Subtask[];
}
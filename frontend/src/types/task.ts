export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    order: number;
    created_at?: string;
    updated_at?: string;
    deadline?: string;
}

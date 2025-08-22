// backend/src/models/Task.ts
export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: "todo" | "doing" | "done"; // hoặc string
    order: number;
    created_at: Date;
    updated_at: Date;
}

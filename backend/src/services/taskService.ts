import pool from "../config/db";
import { Task } from "../models/Task";

/**
 * Lấy tất cả tasks
 */
export const getAllTasks = async (): Promise<Task[]> => {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    return result.rows;
};

/**
 * Tạo task mới
 * task: omit id/created_at/updated_at
 */
export const createTask = async (
    task: Omit<Task, "id" | "created_at" | "updated_at">
): Promise<Task> => {
    // nếu không truyền order thì default = 1
    const order = typeof task.order === "number" ? task.order : 1;
    const status = task.status ?? "todo";
    const result = await pool.query(
        `INSERT INTO tasks (title, description, status, "order")
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [task.title, task.description ?? null, status, order]
    );
    return result.rows[0];
};

/**
 * Cập nhật các trường (partial update)
 */
export const updateTask = async (
    id: number,
    updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
): Promise<Task | null> => {
    // cho phép update các trường này
    const allowed = ["title", "description", "status", "order"];
    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of allowed) {
        if (key in updates && (updates as any)[key] !== undefined) {
            const col = key === "order" ? `"order"` : key;
            setClauses.push(`${col} = $${idx++}`);
            values.push((updates as any)[key]);
        }
    }

    if (setClauses.length === 0) return null;

    const query = `UPDATE tasks SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
};

/**
 * Cập nhật trạng thái riêng (utility)
 */
export const updateTaskStatus = async (id: number, status: string): Promise<Task | null> => {
    const result = await pool.query(
        `UPDATE tasks SET status=$1, updated_at = NOW() WHERE id=$2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] ?? null;
};

/**
 * Xóa task, trả về true nếu có xóa
 */
export const deleteTask = async (id: number): Promise<boolean> => {
    const result = await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    // result.rowCount có thể là undefined, dùng nullish coalescing
    return (result.rowCount ?? 0) > 0;
};

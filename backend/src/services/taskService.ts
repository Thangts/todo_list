import pool from "../config/db";
import { Task, Subtask } from "../models/Task";

async function getTagsForTask(taskId: number): Promise<string[]> {
    const res = await pool.query(`
        SELECT t.name FROM tags t
        JOIN task_tags tt ON t.id = tt.tag_id
        WHERE tt.task_id = $1
    `, [taskId]);
    return res.rows.map(r => r.name);
}

async function getSubtasksForTask(taskId: number): Promise<Subtask[]> {
    const res = await pool.query(`
        SELECT id, title, done, "order" FROM subtasks WHERE task_id = $1 ORDER BY "order" ASC
    `, [taskId]);
    return res.rows;
}

async function insertTags(taskId: number, tags: string[]) {
    for (const tag of tags) {
        let tagId;
        const existing = await pool.query("SELECT id FROM tags WHERE name = $1", [tag]);
        if (existing.rows.length > 0) {
            tagId = existing.rows[0].id;
        } else {
            const res = await pool.query("INSERT INTO tags (name) VALUES ($1) RETURNING id", [tag]);
            tagId = res.rows[0].id;
        }
        await pool.query("INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [taskId, tagId]);
    }
}

async function insertSubtasks(taskId: number, subtasks: { title: string; done?: boolean; order?: number }[]) {
    for (let i = 0; i < subtasks.length; i++) {
        const st = subtasks[i];
        await pool.query(`
            INSERT INTO subtasks (task_id, title, done, "order") VALUES ($1, $2, $3, $4)
        `, [taskId, st.title, st.done ?? false, st.order ?? (i + 1)]);
    }
}

async function updateTags(taskId: number, tags: string[]) {
    await pool.query("DELETE FROM task_tags WHERE task_id = $1", [taskId]);
    if (tags.length > 0) await insertTags(taskId, tags);
}

async function updateSubtasks(taskId: number, subtasks: { id?: number; title: string; done: boolean; order: number }[]) {
    await pool.query("DELETE FROM subtasks WHERE task_id = $1", [taskId]);
    if (subtasks.length > 0) await insertSubtasks(taskId, subtasks);
}

export const getAllTasks = async (userId: number): Promise<Task[]> => {
    const res = await pool.query("SELECT * FROM tasks WHERE assignee_id = $1 ORDER BY id ASC", [userId]);
    const tasks: Task[] = [];
    for (const row of res.rows) {
        const tags = await getTagsForTask(row.id);
        const subtasks = await getSubtasksForTask(row.id);
        tasks.push({
            ...row,
            start_date: row.start_date ? row.start_date.toISOString() : null,
            due_date: row.due_date ? row.due_date.toISOString() : null,
            completed_at: row.completed_at ? row.completed_at.toISOString() : null,
            created_at: row.created_at ? row.created_at.toISOString() : null,
            updated_at: row.updated_at ? row.updated_at.toISOString() : null,
            tags,
            subtasks,
        });
    }
    return tasks;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
    const res = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
    const row = res.rows[0];
    if (!row) return null;
    const tags = await getTagsForTask(id);
    const subtasks = await getSubtasksForTask(id);
    return {
        ...row,
        start_date: row.start_date ? row.start_date.toISOString() : null,
        due_date: row.due_date ? row.due_date.toISOString() : null,
        completed_at: row.completed_at ? row.completed_at.toISOString() : null,
        created_at: row.created_at ? row.created_at.toISOString() : null,
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
        tags,
        subtasks,
    };
};

export const createTask = async (task: Omit<Task, "id" | "created_at" | "updated_at" | "completed_at">): Promise<Task> => {
    const order = typeof task.order === "number" ? task.order : 0;
    const status = task.status ?? "todo";
    const start_date = task.start_date ?? null;
    const due_date = task.due_date ?? null;
    const category = task.category ?? "personal";
    const priority = task.priority ?? "medium";
    const res = await pool.query(
        `INSERT INTO tasks (board_id, title, description, status, "order", start_date, due_date, category, priority, assignee_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [task.board_id ?? null, task.title, task.description ?? null, status, order, start_date, due_date, category, priority, task.assignee_id ?? null]
    );
    const row = res.rows[0];
    return {
        ...row,
        start_date: row.start_date ? row.start_date.toISOString() : null,
        due_date: row.due_date ? row.due_date.toISOString() : null,
        completed_at: row.completed_at ? row.completed_at.toISOString() : null,
        created_at: row.created_at ? row.created_at.toISOString() : null,
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
    };
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task | null> => {
    const allowed: (keyof Task)[] = ["title", "description", "status", "order", "start_date", "due_date", "completed_at", "category", "priority", "assignee_id"];
    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of allowed) {
        if (key in updates && updates[key] !== undefined) {
            const col = key === "order" ? `"order"` : key;
            setClauses.push(`${col} = $${idx++}`);
            values.push(updates[key]);
        }
    }

    if ("status" in updates && updates.completed_at === undefined) {
        if (updates.status === "done") {
            setClauses.push(`completed_at = NOW()`);
        } else {
            setClauses.push(`completed_at = NULL`);
        }
    }

    if (setClauses.length === 0) return null;

    const query = `UPDATE tasks SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    values.push(id);
    const res = await pool.query(query, values);
    const row = res.rows[0];
    if (!row) return null;
    return {
        ...row,
        start_date: row.start_date ? row.start_date.toISOString() : null,
        due_date: row.due_date ? row.due_date.toISOString() : null,
        completed_at: row.completed_at ? row.completed_at.toISOString() : null,
        created_at: row.created_at ? row.created_at.toISOString() : null,
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
    };
};

export const deleteTask = async (id: number): Promise<boolean> => {
    const res = await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    return (res.rowCount ?? 0) > 0;
};
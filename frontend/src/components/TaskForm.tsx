import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { TaskStatus } from "../types/task";

export default function TaskForm() {
    const { addTask } = useTaskStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await addTask({ title: title.trim(), description: description.trim() || undefined, status, deadline: deadline || undefined });

        setTitle("");
        setDescription("");
        setStatus("todo");
        setDeadline("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, padding: 12, borderRadius: 10, background: "#f3f4f6" }}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} required />
            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ padding: 8, borderRadius: 6, border: "1px solid #d1d5db", resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8 }}>
                <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #d1d5db" }}>
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                </select>
                <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #d1d5db" }} />
            </div>
            <button type="submit" style={{ marginTop: 6, padding: "8px 12px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}>Add Task</button>
        </form>
    );
}

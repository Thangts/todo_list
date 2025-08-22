import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import type { TaskStatus } from "../types/task";

export default function TaskForm() {
    const { addTask } = useTaskStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await addTask(title.trim(), description.trim() || undefined, status);
        setTitle("");
        setDescription("");
        setStatus("todo");
    };

    return (
        <form
            onSubmit={onSubmit}
            style={{
                background: "#0f172a",
                padding: 14,
                borderRadius: 12,
                marginBottom: 18,
                color: "#fff",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <input
                    placeholder="Tiêu đề công việc..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        flex: "1 1 320px",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #334155",
                        background: "#071033",
                        color: "#fff",
                    }}
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #334155",
                        background: "#071033",
                        color: "#fff",
                    }}
                >
                    <option value="todo">🟥 To Do</option>
                    <option value="doing">🟨 Doing</option>
                    <option value="done">🟩 Done</option>
                </select>

                <button
                    type="submit"
                    style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: 8,
                    }}
                >
                    Thêm
                </button>
            </div>

            <div style={{ marginTop: 12 }}>
                <textarea
                    placeholder="Mô tả ngắn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{
                        width: "100%",
                        maxWidth: 965,        // rút ngắn chiều ngang để khỏi tràn
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #334155",
                        background: "#071033",
                        color: "#fff",
                        resize: "vertical",
                        marginTop: 6,
                    }}
                />
            </div>
        </form>
    );
}

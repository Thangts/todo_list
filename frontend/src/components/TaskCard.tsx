import React, { useState } from "react";
import { Task, TaskStatus } from "../types/task";
import { useTaskStore } from "../store/taskStore";

interface Props {
    task: Task;
    innerRef?: (element: HTMLElement | null) => void;
    draggableProps?: any;
    dragHandleProps?: any;
}

export default function TaskCard({ task, innerRef, draggableProps, dragHandleProps }: Props) {
    const { editTask, removeTask } = useTaskStore();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(task.status);

    // màu nền theo status
    const statusColors: Record<TaskStatus, string> = {
        todo: "#fecaca",   // hồng đậm hơn container
        doing: "#fde68a",  // vàng đậm hơn container
        done: "#a7f3d0",   // xanh đậm hơn container
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        await editTask(task.id, {
            title: title.trim(),
            description: description.trim(),
            status,
        });
        setIsEditing(false);
    };

    return (
        <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            style={{
                background: statusColors[task.status], // dùng màu nền theo status
                borderRadius: 10,
                padding: 12,
                boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                marginBottom: 10,
                ...draggableProps?.style, // quan trọng cho drag & drop hoạt động
            }}
        >
            {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        style={{
                            padding: 8,
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            resize: "vertical",
                        }}
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        style={{ padding: 6, borderRadius: 6, border: "1px solid #e2e8f0" }}
                    >
                        <option value="todo">To Do</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                    </select>

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                        <button
                            onClick={handleSave}
                            style={{
                                background: "#10b981",
                                color: "white",
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "none",
                            }}
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{
                                background: "#6b7280",
                                color: "white",
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "none",
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{task.title}</div>
                    {task.description && (
                        <div style={{ marginTop: 6, fontSize: 14, color: "#374151" }}>{task.description}</div>
                    )}

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #3b82f6",
                                background: "#3b82f6",
                                color: "white",
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => removeTask(task.id)}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

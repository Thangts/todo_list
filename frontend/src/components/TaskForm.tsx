import React, { useState } from "react";
import { Task, TaskPriority, Subtask } from "../types/task";

interface TaskFormProps {
    initialData?: Partial<Task>;
    onSubmit: (data: Partial<Task>) => Promise<void> | void;
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData = {}, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData.title ?? "");
    const [description, setDescription] = useState(initialData.description ?? "");
    const [category, setCategory] = useState(initialData.category ?? "general");
    const [priority, setPriority] = useState<TaskPriority>((initialData.priority as TaskPriority) ?? "medium");
    const [startDate, setStartDate] = useState(initialData.start_date ? String(initialData.start_date).slice(0, 10) : "");
    const [dueDate, setDueDate] = useState(initialData.due_date ? String(initialData.due_date).slice(0, 10) : "");
    const [status, setStatus] = useState<Task["status"]>(initialData.status ?? "todo");
    const [tags, setTags] = useState<string[]>(initialData.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [subtasks, setSubtasks] = useState<Omit<Subtask, "id">[]>(initialData.subtasks?.map(st => ({ title: st.title, done: st.done, order: st.order })) ?? []);
    const [subtaskInput, setSubtaskInput] = useState("");

    const addTag = () => {
        const v = tagInput.trim();
        if (v && !tags.includes(v)) setTags(prev => [...prev, v]);
        setTagInput("");
    };

    const addSubtask = () => {
        const v = subtaskInput.trim();
        if (v) {
            setSubtasks(prev => [...prev, { title: v, done: false, order: prev.length + 1 }]);
            setSubtaskInput("");
        }
    };

    const removeSubtask = (index: number) => {
        setSubtasks(prev => prev.filter((_, i) => i !== index));
    };

    const toggleSubtask = (index: number) => {
        setSubtasks(prev => prev.map((st, i) => i === index ? { ...st, done: !st.done } : st));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with data:", { title, description, category, priority, startDate, dueDate, status, tags, subtasks }); // Debug log
        if (!title.trim()) {
            alert("Tiêu đề là bắt buộc");
            return;
        }
        const payload: Partial<Task> = {
            title: title.trim(),
            description: description.trim() || null,
            category,
            priority,
            start_date: startDate ? startDate : null,
            due_date: dueDate ? dueDate : null,
            status,
            tags,
            subtasks: subtasks as Subtask[], // Cast to Subtask[] when sending to backend
        };
        try {
            await onSubmit(payload);
            console.log("onSubmit called successfully"); // Debug log
            if (!initialData?.id) {
                // reset form
                setTitle("");
                setDescription("");
                setCategory("general");
                setPriority("medium");
                setStartDate("");
                setDueDate("");
                setStatus("todo");
                setTags([]);
                setSubtasks([]);
            }
        } catch (err) {
            console.error("Error in onSubmit:", err);
            alert("Có lỗi khi submit form. Kiểm tra console.");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: 8 }}>
                <input type="text" placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
                <textarea placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="row">
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="general">Chung</option>
                    <option value="work">Công việc</option>
                    <option value="personal">Cá nhân</option>
                    <option value="shopping">Mua sắm</option>
                    <option value="study">Học tập</option>
                </select>

                <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                </select>
            </div>

            <div className="row" style={{ marginTop: 8 }}>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            <div className="row" style={{ marginTop: 8 }}>
                <select value={status} onChange={e => setStatus(e.target.value as Task["status"])}>
                    <option value="todo">todo</option>
                    <option value="doing">doing</option>
                    <option value="done">done</option>
                </select>
            </div>

            <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="Thêm nhãn và nhấn Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                    <button type="button" className="btn" onClick={addTag}>Thêm</button>
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {tags.map(t => <div key={t} className="tag">#{t}</div>)}
                </div>
            </div>

            <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="Thêm subtask và Enter" value={subtaskInput} onChange={e => setSubtaskInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }} />
                    <button type="button" className="btn" onClick={addSubtask}>Thêm</button>
                </div>
                <div style={{ marginTop: 8 }}>
                    {subtasks.map((st, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="checkbox" checked={st.done} onChange={() => toggleSubtask(i)} />
                            <span>{st.title}</span>
                            <button type="button" onClick={() => removeSubtask(i)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button className="btn" type="submit">{initialData?.id ? "Cập nhật" : "Thêm"}</button>
                {onCancel && <button type="button" className="btn btn-sm" onClick={onCancel}>Hủy</button>}
            </div>
        </form>
    );
};

export default TaskForm;
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";
import { Task } from "../types/task";
import * as taskApi from "../services/taskService";
import { useAuthStore } from "../store/auth.store";

const TaskList: React.FC = () => {
    const { user, token } = useAuthStore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filtered, setFiltered] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalInitial, setModalInitial] = useState<Partial<Task> | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0); // Thêm retry nếu fail do auth timing

    useEffect(() => {
        if (!user || !token || loading || retryCount >= 2) return; // Kiểm tra token không phải null/undefined
        load();
    }, [user, token, loading, retryCount]); // Dependency bao gồm retryCount

    const load = async () => {
        setLoading(true);
        try {
            console.log("Bắt đầu tải tasks với token:", token ? token.substring(0, 10) + "..." : "No token"); // Xử lý an toàn khi token null
            const data = await taskApi.getAllTasks();
            setTasks(data);
            setFiltered(data);
            console.log("Tasks loaded:", data);
            setRetryCount(0); // Reset retry khi thành công
        } catch (err: any) {
            console.error("Load tasks failed:", err.message, err.response?.data);
            alert("Không thể tải danh sách task. Kiểm tra console.");
            if (err.response?.status === 401 && retryCount < 2) {
                setRetryCount(prev => prev + 1); // Retry nếu 401 (token invalid)
            }
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (filters: { category: string; priority: string }) => {
        let f = tasks.slice();
        if (filters.category) f = f.filter((t) => (t.category ?? "general") === filters.category);
        if (filters.priority) f = f.filter((t) => (t.priority ?? "medium") === filters.priority);
        setFiltered(f);
    };

    const openAddModal = (defaultStatus?: Task["status"]) => {
        setModalInitial({ status: defaultStatus ?? "todo" });
        setShowModal(true);
    };

    const handleCreate = async (data: Partial<Task>) => {
        try {
            const payload: Omit<Task, "id" | "created_at" | "updated_at" | "completed_at"> = {
                title: data.title!.trim(),
                description: data.description ?? null,
                status: (data.status ?? "todo") as Task["status"],
                order: tasks.filter((t) => t.status === (data.status ?? "todo")).length + 1,
                start_date: data.start_date ?? null,
                due_date: data.due_date ?? null,
                category: data.category ?? "general",
                priority: (data.priority as Task["priority"]) ?? "medium",
                assignee_id: user?.id ?? null, // Gán task cho user hiện tại
                tags: data.tags ?? [],
                subtasks: data.subtasks ?? [],
            };
            console.log("Creating task with payload:", payload);
            const created = await taskApi.createTask(payload);
            console.log("Task created:", created);
            const newTasks = [...tasks, created];
            setTasks(newTasks);
            setFiltered(newTasks);
            setShowModal(false);
        } catch (err) {
            console.error("Create failed", err);
            alert("Tạo task thất bại. Kiểm tra console.");
        }
    };

    const handleUpdate = async (id: number, updates: Partial<Task>) => {
        try {
            const updated = await taskApi.updateTask(id, updates);
            const newTasks = tasks.map((t) => (t.id === id ? updated : t));
            setTasks(newTasks);
            setFiltered(newTasks);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await taskApi.deleteTask(id);
            const newTasks = tasks.filter((t) => t.id !== id);
            setTasks(newTasks);
            setFiltered(newTasks);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleDrop = async (taskId: number, newStatus: Task["status"]) => {
        await handleUpdate(taskId, { status: newStatus });
    };

    const handleEditOpen = (task: Task) => {
        setModalInitial(task);
        setShowModal(true);
    };

    return (
        <div>
            <Navbar onApplyFilters={applyFilters} onOpenAdd={() => openAddModal("todo")} />

            <div className="container">
                <h2 style={{ marginTop: 12, marginBottom: 8 }}>📋 To-Do List</h2>

                <div className="board">
                    <TaskColumn
                        title="To Do"
                        status="todo"
                        tasks={filtered.filter((t) => t.status === "todo")}
                        onDropTask={handleDrop}
                        onDeleteTask={handleDelete}
                        onOpenAdd={(s) => openAddModal(s)}
                        onEdit={handleEditOpen}
                    />

                    <TaskColumn
                        title="Doing"
                        status="doing"
                        tasks={filtered.filter((t) => t.status === "doing")}
                        onDropTask={handleDrop}
                        onDeleteTask={handleDelete}
                        onOpenAdd={(s) => openAddModal(s)}
                        onEdit={handleEditOpen}
                    />

                    <TaskColumn
                        title="Done"
                        status="done"
                        tasks={filtered.filter((t) => t.status === "done")}
                        onDropTask={handleDrop}
                        onDeleteTask={handleDelete}
                        onOpenAdd={(s) => openAddModal(s)}
                        onEdit={handleEditOpen}
                    />
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onMouseDown={() => { }}>
                    <div className="modal">
                        <h3 style={{ marginBottom: 8 }}>{modalInitial?.id ? "Chỉnh sửa task" : "Thêm task"}</h3>
                        <TaskForm
                            initialData={modalInitial}
                            onSubmit={async (data) => {
                                if (modalInitial?.id) {
                                    await handleUpdate(modalInitial.id as number, data);
                                    setShowModal(false);
                                } else {
                                    await handleCreate(data);
                                }
                            }}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
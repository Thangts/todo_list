// frontend/src/components/TaskColumn.tsx
import React from "react";
import { Task, TaskStatus } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onDropTask: (taskId: number, newStatus: TaskStatus) => void;
    onDeleteTask?: (id: number) => Promise<void> | void;
    onOpenAdd?: (defaultStatus?: TaskStatus) => void;
    onEdit?: (task: Task) => void;
}

const TaskColumn: React.FC<Props> = ({ title, status, tasks, onDropTask, onDeleteTask, onOpenAdd, onEdit }) => {
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const idStr = e.dataTransfer.getData("taskId");
        const id = Number(idStr);
        if (!isNaN(id)) onDropTask(id, status);
    };

    return (
        <div className={`column ${status}`} onDragOver={handleDragOver} onDrop={handleDrop}>
            <h3>
                {title} <span className="count">{tasks.length}</span>
            </h3>

            <div style={{ marginBottom: 8 }}>
                <button className="btn btn-sm" onClick={() => onOpenAdd?.(status)}>Thêm</button>
            </div>

            <div>
                {tasks.map(task => (
                    <div key={task.id} onDragStart={e => e.dataTransfer.setData("taskId", String(task.id))} draggable>
                        <TaskCard task={task} onDelete={async (id) => { if (onDeleteTask) await onDeleteTask(id); }} onEdit={(t) => onEdit?.(t)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskColumn;
// frontend/src/components/TaskCard.tsx
import React from "react";
import { Task } from "../types/task";

interface Props {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const getPriorityClass = (p?: string) => {
  if (p === "high") return "p-high";
  if (p === "medium") return "p-medium";
  return "p-low";
};

const TaskCard: React.FC<Props> = ({ task, onDelete, onEdit }) => {
  const overdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";
  return (
    <div className={`card ${overdue ? "overdue" : ""}`} draggable>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{task.title}</div>
          {task.description && <div className="small" style={{ marginTop: 6 }}>{task.description}</div>}
        </div>
        <div className={getPriorityClass(task.priority ?? "medium")}>{(task.priority ?? "medium").toUpperCase()}</div>
      </div>

      <div className="meta">
        <div>Danh mục: {task.category ?? "Chung"}</div>
        {task.start_date && <div>BĐ: {new Date(task.start_date).toLocaleDateString()}</div>}
        {task.due_date && <div>Hạn: {new Date(task.due_date).toLocaleDateString()}</div>}
        {task.subtasks && <div>{task.subtasks.filter(s => s.done).length}/{task.subtasks.length} công việc nhỏ</div>}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {task.tags.map(t => <div className="tag" key={t}>#{t}</div>)}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <button className="btn btn-sm" onClick={() => onEdit(task)}>Sửa</button>
        <button className="btn btn-sm" onClick={() => onDelete(task.id)} style={{ background: "#ef4444" }}>Xóa</button>
      </div>
    </div>
  );
};

export default TaskCard;

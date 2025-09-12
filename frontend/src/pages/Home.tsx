import React, { useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTaskStore } from "../store/taskStore";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { Task, TaskStatus } from "../types/task";

const STATUSES: TaskStatus[] = ["todo", "doing", "done"];
const LABEL: Record<TaskStatus, string> = { todo: "To Do", doing: "Doing", done: "Done" };
const COLUMN_BG: Record<TaskStatus, string> = { todo: "#FEF3F2", doing: "#FFFBEB", done: "#ECFDF5" };

export default function Home() {
  const { tasks, fetchTasks, replaceAll, bulkUpdate } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    for (const t of tasks) map[t.status].push(t);
    STATUSES.forEach((s) => map[s].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    return map;
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const src = [...grouped[sourceStatus]];
    const dst = sourceStatus === destStatus ? src : [...grouped[destStatus]];

    const [moved] = src.splice(source.index, 1);
    const movedCopy: Task = { ...moved, status: destStatus };

    dst.splice(destination.index, 0, movedCopy);

    const reSrc = sourceStatus === destStatus ? [] : src.map((t, i) => ({ ...t, status: sourceStatus, order: i + 1 }));
    const reDst = dst.map((t, i) => ({ ...t, status: destStatus, order: i + 1 }));
    const untouched = tasks.filter((t) => t.status !== sourceStatus && t.status !== destStatus);
    const newAll = sourceStatus === destStatus ? [...untouched, ...reDst] : [...untouched, ...reSrc, ...reDst];

    replaceAll(newAll);

    const updates = sourceStatus === destStatus ? reDst : [...reSrc, ...reDst];
    await bulkUpdate(updates.map((t) => ({ id: t.id, updates: { status: t.status, order: t.order } })));
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>📋 To-Do List</h1>
      <TaskForm />
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {STATUSES.map((status) => (
            <div key={status} style={{ flex: 1, background: COLUMN_BG[status], padding: 12, borderRadius: 12, minHeight: 480, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{LABEL[status]}</h2>
                <span style={{ fontSize: 13, color: "#374151" }}>{grouped[status].length}</span>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    {grouped[status].map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(drProv) => (
                          <TaskCard task={task} innerRef={drProv.innerRef} draggableProps={drProv.draggableProps} dragHandleProps={drProv.dragHandleProps} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

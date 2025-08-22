import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "../types/task";

interface Props {
    status: TaskStatus;
    title: string;
    tasks: Task[];
    color: string;
}

export default function TaskColumn({ status, title, tasks, color }: Props) {
    return (
        <div
            style={{
                flex: 1,
                background: color,
                padding: 12,
                borderRadius: 12,
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h3
                style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 12,
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {title} <span>{tasks.length}</span>
            </h3>

            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ flex: 1 }}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <TaskCard
                                        task={task}
                                        innerRef={provided.innerRef}
                                        draggableProps={provided.draggableProps}
                                        dragHandleProps={provided.dragHandleProps}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

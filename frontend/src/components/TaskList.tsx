import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
    tasks: Task[];
    droppableId: string;
}

export default function TaskList({ tasks, droppableId }: Props) {
    return (
        <Droppable droppableId={droppableId}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        background: "#f9fafb",
                        padding: 12,
                        borderRadius: 10,
                        minHeight: 200,
                    }}
                >
                    {tasks.map((task, index) => (
                        <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
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
    );
}

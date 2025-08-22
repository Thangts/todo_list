// backend/src/controllers/taskController.ts
import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const getAllTasks = async (_req: Request, res: Response) => {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, order } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const task = await taskService.createTask({ title, description, status, order });
    res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid task id" });

    const updated = await taskService.updateTask(id, req.body);
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updated = await taskService.updateTaskStatus(id, status);
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
};

export const deleteTask = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid task id" });

    const ok = await taskService.deleteTask(id);
    if (!ok) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
};

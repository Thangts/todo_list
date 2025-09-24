import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Lấy user.id từ auth middleware
        const tasks = await taskService.getAllTasks(userId); // Truyền userId vào service
        res.json(tasks);
    } catch (err) {
        console.error("getTasks error", err);
        res.status(500).json({ message: "Lỗi server khi lấy tasks" });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const taskData = req.body;
        const newTask = await taskService.createTask(taskData);
        res.status(201).json(newTask);
    } catch (err) {
        console.error("createTask error", err);
        res.status(400).json({ message: "Lỗi khi tạo task" });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        const updatedTask = await taskService.updateTask(id, updates);
        if (!updatedTask) {
            return res.status(404).json({ message: "Task không tìm thấy" });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error("updateTask error", err);
        res.status(400).json({ message: "Lỗi khi cập nhật task" });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await taskService.deleteTask(id);
        if (!success) {
            return res.status(404).json({ message: "Task không tìm thấy" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("deleteTask error", err);
        res.status(400).json({ message: "Lỗi khi xóa task" });
    }
};
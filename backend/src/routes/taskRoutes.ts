// backend/src/routes/taskRoutes.ts
import { Router } from "express";
import * as taskController from "../controllers/taskController";

const router = Router();

// GET /tasks
router.get("/", taskController.getAllTasks);

// POST /tasks
router.post("/", taskController.createTask);

// PUT /tasks/:id
router.put("/:id", taskController.updateTask);

// PATCH /tasks/:id/status
router.patch("/:id/status", taskController.updateTaskStatus);

// DELETE /tasks/:id
router.delete("/:id", taskController.deleteTask);

export default router;

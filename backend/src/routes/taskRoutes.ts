//backend/src/routes/taskRoutes.ts
import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// protect these routes
router.use(requireAuth);

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;

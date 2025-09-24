//backend/src/routes/authroutes.ts
import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refreshToken);
router.get("/me", requireAuth, AuthController.me);

export default router;

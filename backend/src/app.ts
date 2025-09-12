// app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

// CORS & cookies
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/tasks", taskRoutes);

export default app;

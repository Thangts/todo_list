import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app = express();

// cho phép FE gọi BE
app.use(cors({
    origin: "http://localhost:5173", // FE chạy ở đây
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/tasks", taskRoutes);

export default app;

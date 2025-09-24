//backend/src/server.ts
import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const shutdown = (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close((err?: Error) => {
        if (err) {
            console.error("Error closing server:", err);
            process.exit(1);
        }
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    shutdown("uncaughtException");
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdown("unhandledRejection");
});

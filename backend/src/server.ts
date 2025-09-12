// server.ts
import dotenv from "dotenv";

// Load .env trước khi import app
dotenv.config();

import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET ? "OK" : "MISSING");
});

/** Graceful shutdown */
const shutdown = (signal: string) => {
    console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
    server.close((err?: Error) => {
        if (err) {
            console.error("❌ Error during server close:", err);
            process.exit(1);
        }
        console.log("👋 Server closed. Bye!");
        process.exit(0);
    });

    // Force exit sau 10s nếu không close được
    setTimeout(() => {
        console.error("⏱️ Forcing shutdown after timeout.");
        process.exit(1);
    }, 10_000).unref();
};

// Bắt các tín hiệu hệ thống
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Bắt lỗi không mong muốn
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    shutdown("unhandledRejection");
});

import express, { Request, Response } from "express";
import router from "./Routers/Routes";
import logger from "./logger"; // 👈 Import here
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env["PORT"] || 4000;

// Middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", router);

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript + pnpm 🔥" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

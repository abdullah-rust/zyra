import http from "http";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { checkJwt } from "./middleware/checkjwt";
import cors from "cors";
import ChatHandler from "./Chat/ChatSocketHandler";
import logger from "./logger"; // 👈 Import here

dotenv.config();

const app = express();
const PORT: number = Number(process.env["PORT"]) || 4001;

app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from server2");
});

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

const io = new Server(server, {
  cors: { origin: "*" },
  path: "/",
});

io.use(checkJwt);

// ✅ Connection handler
io.on("connection", (socket) => {
  ChatHandler(io, socket);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

const start = async () => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at 0.0.0.0:${PORT}`);
  });
};

start();

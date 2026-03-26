// src/index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { Chat } from "./service/chat.service";
import cookieParser from "cookie-parser";
import { checkJwt } from "./middleware/check.jwt";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  // Path ko default rehne do ya khali chhor do agar Caddy handle_path use kar raha hai
  path: "/socket.io/",
  cors: {
    origin: "https://localhost",
    credentials: true,
  },
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

checkJwt(io);
Chat(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Chat server is running on port ${PORT}`);
});

import http from "http";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "./clients/redisClient";
import dotenv from "dotenv";
import ChatHandler from "./chat/chatSocket";
import { checkJwt } from "./middleware/checkjwt";
import cors from "cors";
import router from "./router/routes";
import { connectDB } from "./clients/mongodb";
dotenv.config();

const app = express();
const PORT: number = Number(process.env["PORT"]) || 4001;

app.use(express.json());
app.use(cookieParser());
app.use("/", router);
const server = http.createServer(app);
const subClient = redis.duplicate();

const devOrigins = ["http://localhost:5173", "http://10.228.92.186:5173"];

const allowedOrigins = [...devOrigins];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from server2");
});

const io = new Server(server, {
  cors: { origin: "*" },
  path: "/chat",
});
io.adapter(createAdapter(redis, subClient));

io.use(checkJwt);

// ✅ Connection handler
io.on("connection", (socket) => {
  ChatHandler(io, socket);
});

const start = async () => {
  await connectDB(); // Pehle DB se connect ho jao
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at 0.0.0.0:${PORT}`);
  });
};

start();

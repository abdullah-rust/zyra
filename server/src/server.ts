// src/index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { appRouter } from "./routes/app.routes";
import { DatabaseWorkerService } from "./service/worker/message.push.db";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middlewares
app.set("trust proxy", 1);
app.use(cookieParser()); // cokkie parser
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Logging for development
app.use("/", appRouter);

DatabaseWorkerService();

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

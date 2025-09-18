import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express + TypeScript + Strict Mode 🚀");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at 0.0.0.0:${PORT}`);
});

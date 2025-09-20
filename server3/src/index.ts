import express, { Request, Response } from "express";
import dotenv from "dotenv";

import router from "./router/routes";
dotenv.config();

const app = express();
const PORT: number = Number(process.env["PORT"]) || 4002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use("/", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, from server3 🚀");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at 0.0.0.0:${PORT}`);
});

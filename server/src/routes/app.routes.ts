import { Router, Request, Response } from "express";
import { authRouter } from "./auth.routes";

export const appRouter = Router();

appRouter.get("/", async (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

appRouter.use("/auth", authRouter);

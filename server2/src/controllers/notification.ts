import { Request, Response } from "express";

export async function fetchmessages(req: Request, res: Response) {
  try {
  } catch (e) {
    console.log("fetch messag Error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

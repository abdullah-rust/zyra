import { Request, Response } from "express";
import pool from "../clients/postgresClient";
import logger from "../logger";

export async function EditProfile(req: Request, res: Response) {
  try {
    
  } catch (e) {
    logger.error(`Edit Profile Error:${e}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

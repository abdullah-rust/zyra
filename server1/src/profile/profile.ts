import { Request, Response } from "express";
import pool from "../clients/postgresClient"; // your PG client instance
import logger from "../logger"; // optional

export async function getProfile(req: Request, res: Response) {
  const userId = (req as any).user.userId; // /api/profile/:id

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, username, email, bio, img_link
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ profile: result.rows[0] });
  } catch (error) {
    logger.error(`Profile Fetch Error: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}

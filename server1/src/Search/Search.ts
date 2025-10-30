import { Request, Response } from "express";
import pool from "../clients/postgresClient"; // your PG client instance
import logger from "../logger"; // optional

export async function searchUsers(req: Request, res: Response) {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    let result;

    // Pehle ID se try karo (agar UUID format mein hai)
    try {
      result = await pool.query(
        `SELECT id, name, username FROM users WHERE id = $1 LIMIT 1`,
        [q]
      );

      // Agar ID se mil gaya toh wahi return karo
      if (result.rows.length > 0) {
        return res.status(200).json({ users: result.rows });
      }
    } catch (idError) {
      // ID search fail hui (invalid UUID), toh normal search karo
      // Isko ignore karo aur aage badho
    }

    // Normal name/username search
    result = await pool.query(
      `SELECT id, name, username
       FROM users 
       WHERE name ILIKE $1 OR username ILIKE $1 
       LIMIT 20`,
      [`%${q}%`]
    );

    return res.status(200).json({ users: result.rows });
  } catch (error) {
    logger.error(`Search Error: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { Request, Response } from "express";
import redis from "../clients/redisClient";

export async function searchusers(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data || !data.username) {
      return res.status(400).json({ message: "please insert username" });
    }

    const username = data.username;
    const results: any[] = [];

    let cursor = 0;
    do {
      const reply = await redis.scan(
        cursor,
        "MATCH",
        `*${username}*`,
        "COUNT",
        100
      );
      cursor = Number(reply[0]);
      const keys: string[] = reply[1];
      for (const key of keys) {
        const user = await redis.get(key);
        // ✅ Ab yahan try...catch block lagao
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            results.push(parsedUser);
          } catch (parseError) {
            // Agar JSON.parse fail ho jaye to is key ko skip kar do
            console.warn(`Skipping key ${key}: Value is not valid JSON`);
          }
        }
      }
    } while (cursor !== 0);

    if (results.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.json({ users: results });
  } catch (e) {
    console.log("Redis search error:", e);
    return res.status(500).json({ message: "internal server Error" });
  }
}

import { Request, Response } from "express";
import redis from "../clients/redisClient";

export async function getProfile(req: Request, res: Response) {
  try {
    // ✅ User data req.user se lo, req.body se nahi
    const user = (req as any).user;

    // ✅ Yahan ek check lagana zaroori hai
    if (!user || !user.username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await redis.get(user.username);

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(JSON.parse(data));
  } catch (e) {
    console.log("profile get Error", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

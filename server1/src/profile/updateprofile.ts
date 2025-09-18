import { Request, Response } from "express";
import pool from "../clients/postgresClient";
import redis from "../clients/redisClient";
import minioClient from "../clients/minio";

interface Data {
  userId: string;
  username: string;
  name?: string;
  bio?: string;
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { userId, name, username, bio } = req.body as Data;

    // Prepare dynamic fields
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (bio) {
      fields.push(`bio = $${index++}`);
      values.push(bio);
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided" });
    }

    // Add userId at the end
    values.push(userId);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, username, email, bio, img_link
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const getredis = await redis.get(username);

    if (!getredis) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const fromredis = JSON.parse(getredis);

    fromredis.name = result.rows[0].name;
    fromredis.bio = result.rows[0].bio;
    fromredis.img_link = result.rows[0].img_link;

    const setredis = await redis.set(username, JSON.stringify(fromredis));

    if (!setredis) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.error("Profile update error", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function upload_profile_image(
  req: Request,
  res: Response
): Promise<any | Response> {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.json({ success: true });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ message: "Upload failed" });
  }
}

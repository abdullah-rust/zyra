import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export async function Logout(_req: Request, res: Response) {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env["P"] == "production",
      sameSite: "lax",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env["P"] == "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

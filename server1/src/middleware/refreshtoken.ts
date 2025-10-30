import { Request, Response } from "express";
import { verifyRefreshToken, createAccessToken } from "../utils/jwt";
import { TokenExpiredError } from "jsonwebtoken";

export async function refresh(req: Request, res: Response): Promise<any> {
  const refreshToken = req.cookies["refresh_token"];

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Login again: No refresh token provided." });
  }

  // ✅ Debugging ke liye token ko log karen
  console.log("Received refresh token:", refreshToken);

  try {
    const decoderefresh = await verifyRefreshToken(refreshToken);

    // Naya access token banayen
    const newAccessToken = await createAccessToken(decoderefresh.userId);

    if (!newAccessToken) {
      return res.status(500).json({
        message: "Internal Server Error: Failed to create new token.",
      });
    }

    // ✅ Access token ka maxAge sahi set karen (jese 1 hour)
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    // Yahan hum refresh token ko bhi renew kar sakte hain
    // agar aap chahain. Abhi iski zaroorat nahi.

    return res.status(200).json({ message: "New access token issued." });
  } catch (err: any) {
    console.error("JWT Error:", err);
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Login again: Refresh token is expired." });
    }
    // Agar koi aur ghalati hai, jese token invalid
    return res
      .status(401)
      .json({ message: "Login again: Invalid refresh token." });
  }
}

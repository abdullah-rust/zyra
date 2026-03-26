import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt";

const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json("You are not authenticated!");
    }

    const checkRefreshToken: any = verifyRefreshToken(refreshToken);

    if (!checkRefreshToken) {
      return res.status(403).json("Refresh token is not valid!");
    }

    const newAccessToken = generateAccessToken({ id: checkRefreshToken.id });

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (err: any) {
    logger.error("Refresh Tokken Error", err);
    return res.status(500).json("Internal Server Error");
  }
}

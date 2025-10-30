import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../logger";
import { getVerificationCode, deleteVerificationCode } from "./other";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import pool from "../clients/postgresClient";

/* ────────────────────────────────
  SIGNUP OTP STRUCT
──────────────────────────────── */
interface SignUpOTPStruct {
  email: string;
  code: string;
  typeSubmit: "Login" | "SignUp";
}

/* ────────────────────────────────
  SIGNUP OTP SCHEMA
──────────────────────────────── */
const SignUpOTPSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  code: z
    .string()
    .trim()
    .length(6, { message: "Code must be exactly 6 characters" }),
  typeSubmit: z.enum(["Login", "SignUp", "Forget"]),
});

/* ────────────────────────────────
  SIGNUP OTP FUNCTION
──────────────────────────────── */
export default async function SignUpOTP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const requestData: SignUpOTPStruct = (req as any).body;
    if (!requestData) {
      res.status(400).json({ message: "Body Data Invalid" });
    }
    const resultParsed: any = SignUpOTPSchema.safeParse(requestData);
    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }
    const data = resultParsed.data;

    // Only proceed if typeSubmit is "SignUp"
    if (data.typeSubmit !== "SignUp") {
      if (typeof next === "function") return next();
      return res.status(400).json({ message: "Invalid typeSubmit context" });
    }

    // Get saved signup data (from Redis)
    const getSaveData = await getVerificationCode(data.email);
    if (!getSaveData) {
      return res.status(400).json({ message: "Code expired or not found" });
    }

    if (getSaveData.code !== data.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Basic field check before inserting into DB
    const { name, username, email, password } = getSaveData;
    if (!name || !username || !email || !password) {
      logger.error(
        `Incomplete data found in verification record for email: ${data.email}`
      );
      return res.status(500).json({ message: "Incomplete signup data" });
    }

    // Remove verification record after success
    await deleteVerificationCode(data.email);

    // Save new user
    const pushDb = await pool.query(
      "INSERT INTO users(name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, username, email, password]
    );

    if (pushDb.rowCount === 0) {
      logger.error(`Database insertion error for email: ${data.email}`);
      return res.status(500).json({ message: "Failed to register user" });
    }

    const userId = pushDb.rows[0].id;

    // Token creation
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);

    if (!accessToken || !refreshToken) {
      logger.error(`Token creation failed for user ID: ${userId}`);
      return res.status(500).json({ message: "Token creation failed" });
    }

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "lax",
    };

    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    return res.status(200).json({ message: "Signup successful" });
  } catch (e: any) {
    logger.error(`Signup OTP Error: ${e.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

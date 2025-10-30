import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../logger";
import { getVerificationCode, deleteVerificationCode } from "./other";
import { createAccessToken, createRefreshToken } from "../utils/jwt";

/* ────────────────────────────────
  LOGIN OTP STRUCT
──────────────────────────────── */
interface LoginOTPStruct {
  email: string;
  code: string;
  typeSubmit: "Login" | "SignUp";
}

/* ────────────────────────────────
  LOGIN OTP SCHEMA
──────────────────────────────── */
const LoginOTPSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  code: z
    .string()
    .trim()
    .min(6, { message: "Code must be exactly 6 characters" })
    .max(6, { message: "Code must be exactly 6 characters" }),
  typeSubmit: z.enum(["Login", "SignUp", "Forget"]),
});

/* ────────────────────────────────
  LOGIN OTP FUNCTION
──────────────────────────────── */
export default async function LoginOTP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const requestData: LoginOTPStruct = (req as any).body;
    if (!requestData) {
      res.status(400).json({ message: "Body Data Invalid" });
    }
    const resultParsed: any = LoginOTPSchema.safeParse(requestData);
    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }
    const data: LoginOTPStruct = resultParsed.data;

    // If it's not a login request, pass to next middleware
    if (data.typeSubmit !== "Login") return next();

    // Fetch saved code from Redis or DB
    const savedData = await getVerificationCode(data.email);
    if (!savedData) {
      return res.status(400).json({ message: "Code expired or not found" });
    }

    if (savedData.code !== data.code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Delete verification code after success
    await deleteVerificationCode(data.email);

    // Generate tokens
    const accessToken = await createAccessToken(savedData.id);
    const refreshToken = await createRefreshToken(savedData.id);

    if (!accessToken || !refreshToken) {
      logger.error(`Token creation failed for user ID: ${savedData.id}`);
      return res.status(500).json({ message: "Token creation failed" });
    }

    // Cookie options (adjust for production)
    const cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "lax",
    };

    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    return res.status(200).json({ message: "Login successful" });
  } catch (e: any) {
    logger.error(`Login OTP Error: ${e.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

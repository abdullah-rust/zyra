import { z } from "zod";
import { Request, Response } from "express";
import pool from "../clients/postgresClient";
import logger from "../logger";
import { hashPassword } from "../utils/paswordHash";
import { saveVerificationCode } from "./other";
import { generate6DigitCode } from "../utils/genrateCode";
import { sendVerificationEmail } from "../utils/emailSend";

/* ────────────────────────────────
   SIGNUP STRUCT
──────────────────────────────── */
interface SignupStruct {
  name: string;
  username: string;
  email: string;
  password: string;
}

/* ────────────────────────────────
   SIGNUP SCHEMA (Validation)
──────────────────────────────── */
export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .trim()
    .min(5, { message: "Username must be at least 5 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

/* ────────────────────────────────
   SIGNUP FUNCTION
──────────────────────────────── */
export default async function Signup(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const requestData: SignupStruct = (req as any).body;
    if (!requestData) {
      res.status(400).json({ message: "Body Data Invalid" });
    }
    const resultParsed: any = SignupSchema.safeParse(requestData);
    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const { name, username, email, password }: SignupStruct = resultParsed.data;

    // ✅ Step 2: Check existing user (email or username)
    const checkUser = await pool.query(
      "SELECT id, email, username FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (checkUser.rowCount !== 0) {
      const existing = checkUser.rows[0];
      if (existing.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existing.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // ✅ Step 3: Hash password
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      logger.error("Password hashing failed");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // ✅ Step 5: Generate verification code
    const code = await generate6DigitCode();

    // ✅ Step 6: Save verification code in Redis
    const saved = await saveVerificationCode(
      { name, username, email, password: hashedPassword },
      code
    );

    if (!saved) {
      logger.error("Redis save verification error");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // ✅ Step 7: Send verification email
    const emailSent = await sendVerificationEmail(email, code);
    if (!emailSent) {
      logger.error("Email verification sending error");
      return res.status(500).json({
        message: "Internal Server Error: Email sending failed",
      });
    }

    // ✅ Step 8: Success
    return res
      .status(200)
      .json({ message: "Verification code sent successfully" });
  } catch (e: any) {
    logger.error(`Signup Error: ${e.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

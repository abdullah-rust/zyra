import { z } from "zod";
import { Request, Response } from "express";
import pool from "../clients/postgresClient";
import logger from "../logger";
import { verifyPassword } from "../utils/paswordHash";
import { saveVerificationCode } from "./other";
import { generate6DigitCode } from "../utils/genrateCode";
import { sendVerificationEmail } from "../utils/emailSend";

/* ────────────────────────────────
   LOGIN STRUCT
──────────────────────────────── */
interface LoginStruct {
  id?: string;
  email: string;
  password: string;
}

/* ────────────────────────────────
   LOGIN SCHEMA (Validation)
──────────────────────────────── */
const LoginSchema = z.object({
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
   LOGIN FUNCTION
──────────────────────────────── */
export default async function Login(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const requestData: LoginStruct = (req as any).body;
    if (!requestData) {
      res.status(400).json({ message: "Body Data Invalid" });
    }
    const resultParsed: any = LoginSchema.safeParse(requestData);
    if (!resultParsed.success) {
      const zodError = resultParsed.error;
      const issuesArray = zodError.issues;
      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];
        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const { email, password }: LoginStruct = resultParsed.data;

    // ✅ Check if user exists
    const result = await pool.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = result.rows[0];

    // ✅ Verify password (make sure parameter order matches your function definition)
    const isValidPassword = await verifyPassword(user.password, password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate verification code & save
    const code = await generate6DigitCode();
    const saved = await saveVerificationCode(
      { id: user.id, email, password },
      code
    );

    if (!saved) {
      logger.error("Redis save verification error");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // ✅ Send verification email
    const emailSent = await sendVerificationEmail(email, code);
    if (!emailSent) {
      logger.error("Email verification sending error");
      return res
        .status(500)
        .json({ message: "Internal Server Error: Email sending failed" });
    }

    // ✅ Success
    return res.status(200).json({ message: "Email verification code sent" });
  } catch (e: any) {
    logger.error(`Login Error: ${e.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

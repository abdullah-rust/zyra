import { Response, Request } from "express";
import { z } from "zod";
import pool from "../../clients/postgresClient";
import { sendVerificationEmail } from "../../utils/emailSend";
import { generate6DigitCode } from "../../utils/genrateCode";
import { saveVerificationCode } from "./outher";
/**
 * Zod schema for validating user signup data.
 * - username: string, minimum 8 characters
 * - email: valid email format
 * - password: string, minimum 8 characters
 */
export const userSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

/**
 * Middleware to validate request body against a Zod schema.
 * Returns 400 if validation fails.
 */
export function validateBody(schema: typeof userSchema) {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body); // validate + parse
      next();
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.errors, message: "data not complete" });
    }
  };
}

/**
 * Handles user signup:
 * 1. Checks if email or username already exists.
 * 2. Generates a 6-digit verification code.
 * 3. Stores verification code in Redis (expires in 5 minutes).
 * 4. Sends verification email to the user.
 * 5. Returns error messages for failures.
 */
export async function signup(req: Request, res: Response) {
  try {
    let userData = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      userData.email,
    ]);

    if (result.rows.length != 0) {
      return res.status(400).json({ message: "email alrady exist" });
    }

    const check_name = await pool.query(
      "SELECT username FROM users WHERE username=$1",
      [userData.username]
    );

    if (check_name.rows.length != 0) {
      return res.status(400).json({ message: "Username Alrady Takken" });
    }

    let code = await generate6DigitCode();

    let setRedis = await saveVerificationCode(userData, code);

    if (!setRedis) {
      return res.status(500).json({ message: "redis set error" });
    }
    let send = await sendVerificationEmail(userData.email, code);
    if (!send) {
      return res.status(500).json({ message: "email send error" });
    }

    return res.status(200).json({ message: "email verification code sent" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server Error" });
  }
}

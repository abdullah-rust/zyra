import { Response, Request } from "express";
import { z } from "zod";
import pool from "../../clients/postgresClient";
import { sendVerificationEmail } from "../../utils/emailSend";
import { generate6DigitCode } from "../../utils/genrateCode";
import { saveVerificationCode } from "./outher";
import { verifyPassword } from "../../utils/paswordHash";
export const userSchema2 = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

/**
 * Middleware to validate request body against a Zod schema.
 * Returns 400 if validation fails.
 */
export function validateBody2(schema: typeof userSchema2) {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body); // validate + parse
      next();
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.errors, message: "data not complete " });
    }
  };
}

export async function signin(req: Request, res: Response) {
  try {
    let userData = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      userData.email,
    ]);

    if (result.rows.length <= 0) {
      return res.status(400).json({ message: "user Not found" });
    }

    const user = result.rows[0];

    if (!(await verifyPassword(user.password_hash, userData.password))) {
      return res.status(400).json({ message: "Invalid password" });
    }

    let code = await generate6DigitCode();

    let setRedis = await saveVerificationCode(userData, code);

    if (!setRedis) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    let send = await sendVerificationEmail(userData.email, code);

    if (!send) {
      return res.status(500).json({ message: "email send error" });
    }

    return res.status(200).json({ message: "email verification code sent" });
  } catch (e) {
    console.log("signin error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

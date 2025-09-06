// ✅ Import required modules and helpers
import { Response, Request } from "express";
import pool from "../../clients/postgresClient"; // PostgreSQL client (connection pool)
import { z } from "zod"; // Schema validation library
import { getVerificationCode, deleteVerificationCode } from "./outher"; // Redis se verification code lene wala helper
import { createJwt } from "../../utils/jwt"; // JWT token create karne ka helper
import { hashPassword } from "../../utils/paswordHash"; // Password ko hash karne ka helper

// ✅ Schema for validating request body using zod
export const schema = z.object({
  email: z.string().trim().email(), // email valid honi chahiye
  code: z.string().length(6), // 6 digit ka verification code
});

// ✅ Middleware: validate body before processing request
export function validateBody3(schemas: typeof schema) {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body); // Validate + parse body
      next(); // Agar valid hai to next handler chalega
    } catch (err: any) {
      // Agar validation fail ho jaye to error response bhejna
      return res
        .status(400)
        .json({ error: err.errors, message: "data not complete" });
    }
  };
}

// ✅ Function: Signin verification handler
export async function signinVerify(req: Request, res: Response) {
  try {
    const data = req.body;

    // Redis se verification code fetch karo
    const fetchFromRedis = await getVerificationCode(data.email);

    if (fetchFromRedis == null) {
      // Agar code expire ho gaya hai ya nahi mila
      return res.status(400).json({ message: "code expired" });
    }
    if (data.code != fetchFromRedis.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    await deleteVerificationCode(data.email); // Verification code ko Redis se delete kar do

    // JWT token generate karo
    let token = await createJwt(fetchFromRedis.id, fetchFromRedis.email);

    if (token == undefined) {
      // Agar token create na ho
      return res.status(500).json({ message: "Internal server Error" });
    }

    // Success response ke sath token bhejna
    return res.status(200).json({ token: token, message: "signin success" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal server Error" });
  }
}

// ✅ Function: Signup verification handler
export async function signupVerify(req: Request, res: Response) {
  try {
    const data = req.body;

    // Redis se verification code fetch karo
    const fetchFromRedis = await getVerificationCode(data.email);

    if (fetchFromRedis == null) {
      // Agar code expire ho gaya hai ya nahi mila
      return res.status(400).json({ message: "code expired" });
    }

    if (data.code != fetchFromRedis.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    await deleteVerificationCode(data.email); // Verification code ko Redis se delete kar do
    // Password ko hash karna
    const hashedPassword = await hashPassword(fetchFromRedis.password);
    if (hashedPassword == null) {
      return res.status(500).json({ message: "internal server Error" });
    }

    // User ko database me insert karna
    const pushDb = await pool.query(
      "INSERT INTO users(username,email,password_hash) VALUES($1,$2,$3) RETURNING id,email",
      [fetchFromRedis.username, fetchFromRedis.email, hashedPassword]
    );

    if (pushDb.rowCount == 0) {
      // Agar insert fail ho gaya
      return res.status(500).json({ message: "internal server Error" });
    }

    if (pushDb.rows.length == 0) {
      return res.status(500).json({ message: "Internal server Error" });
    } else {
      // JWT token create karna
      let token = await createJwt(pushDb.rows[0].id, pushDb.rows[0].email);

      if (token == undefined) {
        return res.status(500).json({ message: "Internal server Error" });
      }

      // Success response
      return res.status(200).json({ token: token, message: "signup success" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal server Error" });
  }
}

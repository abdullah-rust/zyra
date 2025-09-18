import { Request, Response } from "express";
import pool from "../../clients/postgresClient";
import { saveVerificationCode } from "./other";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";

interface Signup {
  name: string;
  username: string;
  email: string;
  password: string;
}

export async function Signup(
  req: Request,
  res: Response
): Promise<Response | any> {
  try {
    // import data from body
    const data: Signup = req.body;
    // check user alrady exist
    const checkuser = await pool.query(
      "SELECT email FROM users WHERE email=$1",
      [data.email]
    );

    if (checkuser.rowCount != 0) {
      return res.status(400).json({ message: "User Alrady Exist " });
    }

    const check_name = await pool.query(
      "SELECT username FROM users WHERE username=$1",
      [data.username]
    );

    if (check_name.rows.length != 0) {
      return res.status(400).json({ message: "Username Alrady Takken" });
    }
    // save data on redis fro verification
    const code = await generate6DigitCode();
    const save = await saveVerificationCode(data, code);
    if (!save) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // send code on email
    const sendCode = await sendVerificationEmail(data.email, code);
    if (!sendCode) {
      res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "email verification code sent" });
  } catch (e) {
    console.log("from signup Error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

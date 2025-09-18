import { Request, Response } from "express";
import pool from "../../clients/postgresClient";
import { saveVerificationCode } from "./other";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";
import { verifyPassword } from "../../utils/paswordHash";

interface Login {
  id?: string;
  username?: string;
  email: string;
  password: string;
}

export async function Login(
  req: Request,
  res: Response
): Promise<Response | any> {
  try {
    const data: Login = req.body;
    // check user exist
    const checkUser = await pool.query(
      "SELECT id,username,password FROM users WHERE email=$1",
      [data.email]
    );
    if (checkUser.rowCount == 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const checkPassword = await verifyPassword(
      checkUser.rows[0].password,
      data.password
    );

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // save data for varification
    const code = await generate6DigitCode();
    data.id = checkUser.rows[0].id;
    data.username = checkUser.rows[0].username;
    const save = saveVerificationCode(data, code);
    if (!save) {
      res.status(500).json({ message: "Internal Server Error" });
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

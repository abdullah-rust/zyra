// controllers/auth/okAuth.ts
import { Request, Response } from "express";
import pool from "../../clients/postgresClient";
import { deleteVerificationCode, getVerificationCode } from "./other";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import { hashPassword } from "../../utils/paswordHash";
import { singleSet } from "../../other/setusertoredis";

interface Data {
  email: string;
  code: string;
  typesubmit: "login" | "signup";
}

interface Login {
  id: string;
  username: string;
  email: string;
  password: string;
  code: string;
}

interface Signup {
  name: string;
  username: string;
  email: string;
  password: string;
  code: string;
}

//////////////////////////////
// login
//////////////////////////////

export async function OkLogin(
  req: Request,
  res: Response,
  next: Function
): Promise<Response | void> {
  try {
    const data: Data = req.body;
    if (data.typesubmit === "signup") {
      return next();
    }

    // fetch data from redis (verification code + user info)
    const fetchFromRedis: Login | null = await getVerificationCode(data.email);

    if (!fetchFromRedis) {
      return res.status(400).json({ message: "code expired" });
    }

    // if code not match
    if (data.code !== fetchFromRedis.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // JWT token generate
    const token = await createAccessToken(
      fetchFromRedis.id,
      fetchFromRedis.username
    );
    const token2 = await createRefreshToken(
      fetchFromRedis.id,
      fetchFromRedis.username
    );

    // delete verification code from redis
    await deleteVerificationCode(data.email);

    if (!token || !token2) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", token2, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    return res.status(200).json({ message: "login successful" });
  } catch (e) {
    console.error("OkLogin Error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

//////////////////////////////
// Signup
//////////////////////////////

export async function OkSignup(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const data: Data = req.body;

    // fetch data from redis
    const fetchFromRedis: Signup | null = await getVerificationCode(data.email);

    if (!fetchFromRedis) {
      return res.status(400).json({ message: "code expired" });
    }

    if (data.code !== fetchFromRedis.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // password hash
    const password = await hashPassword(fetchFromRedis.password);
    if (!password) {
      console.error("hashPassword returned empty for:", fetchFromRedis.email);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // insert into database
    const pushDb = await pool.query(
      "INSERT INTO users(name,username,email,password) VALUES ($1,$2,$3,$4) RETURNING id",
      [
        fetchFromRedis.name,
        fetchFromRedis.username,
        fetchFromRedis.email,
        password,
      ]
    );

    if (pushDb.rowCount === 0) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // delete verification code from redis
    await deleteVerificationCode(data.email);

    const user = {
      id: pushDb.rows[0].id,
      name: fetchFromRedis.name,
      username: fetchFromRedis.username,
      email: fetchFromRedis.email,
      bio: "Avalible",
      img_link: "",
    };

    await singleSet(user);

    // create JWTs
    const userId = pushDb.rows[0].id;
    const username = pushDb.rows[0].username;

    const token = await createAccessToken(userId, username);
    const token2 = await createRefreshToken(userId, username);

    if (!token || !token2) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", token2, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
    return res.status(200).json({ message: "signup successful" });
  } catch (e) {
    console.error("OkSignup Error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

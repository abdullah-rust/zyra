import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env["JWT_SECRET"]!;
const REFRESH_SECRET = process.env["REFRESH_SECRET"]!; // alag secret

// Access Token
export async function createAccessToken(
  id: string | number,
  username: string
): Promise<string> {
  return jwt.sign({ userId: id, username: username }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Refresh Token
export async function createRefreshToken(
  id: string | number,
  username: string
): Promise<string> {
  return jwt.sign({ userId: id, username: username }, REFRESH_SECRET, {
    expiresIn: "30d",
  });
}

// Verify Access Token
export async function verifyAccessToken(token: string): Promise<any | null> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Verify Refresh Token
export async function verifyRefreshToken(token: string): Promise<any | null> {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    return null;
  }
}

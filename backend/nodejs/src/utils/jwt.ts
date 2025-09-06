import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createJwt(
  id: any,
  email: string
): Promise<string | undefined> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment");
    }
    const token = jwt.sign({ userId: id, email: email }, secret as string, {
      expiresIn: "1h",
    });

    return token;
  } catch (err) {
    console.error("Token generate error:", err);
    return undefined;
  }
}

export async function verifyJwt(token: string): Promise<any | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (e) {
    console.error("JWT verify error:", e);
    return null; // error aye toh null bhejna better hai
  }
}

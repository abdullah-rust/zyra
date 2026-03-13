import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error("❌ Hashing error:", error);
    throw new Error("Password hashing failed");
  }
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error("❌ Verification error:", error);
    return false;
  }
};

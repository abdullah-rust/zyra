import { RedisService } from "../../../lib/redis";
import { LoginOtpRedis, OTP, PasswordChange } from "../../../types/auth.types";
import { logger } from "../../../utils/logger";
import { prisma } from "../../../lib/prisma";
import { hashPassword } from "../../../utils/hash";
import crypto from "crypto";

export async function ForgotPasswordOtpService(
  data: OTP,
): Promise<string | { message: string; code: number }> {
  try {
    const redisfetch: LoginOtpRedis | null = await RedisService.get(data.email);
    if (!redisfetch) {
      return { message: "OTP Expired", code: 400 };
    }
    if (redisfetch.otp !== data.code) {
      return { message: "Invalid OTP", code: 400 };
    }

    RedisService.del(data.email);
    const resetToken = crypto.randomBytes(32).toString("hex");

    await RedisService.set(`reset:${data.email}`, resetToken, 600);

    return resetToken;
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}
export async function PasswordChangeService(
  data: PasswordChange, // Ensure is type mein 'resetToken' field ho
): Promise<{ message: string; code: number }> {
  try {
    const storedToken = await RedisService.get(`reset:${data.email}`);

    if (!storedToken || storedToken !== data.resettoken) {
      return { message: "Invalid or Expired Reset Token", code: 401 };
    }

    const newPsw = await hashPassword(data.newpassword);

    await prisma.user.update({
      where: { email: data.email },
      data: { password: newPsw },
    });

    await RedisService.del(`reset:${data.email}`);

    return { message: "Password Changed Successfully", code: 200 };
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}

import { logger } from "../../../utils/logger";
import { OTP, LoginOtpRedis } from "../../../types/auth.types";
import { RedisService } from "../../../lib/redis";

export async function LoginOtpService(
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

    return redisfetch.id;
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}

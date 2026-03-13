import { RedisService } from "../../../lib/redis";
import { SignupOtpRedis, OTP } from "../../../types/auth.types";
import { logger } from "../../../utils/logger";
import { prisma } from "../../../lib/prisma";

export async function SignupOtpService(
  data: OTP,
): Promise<string | { message: string; code: number }> {
  try {
    const redisfetch: SignupOtpRedis | null = await RedisService.get(
      data.email,
    );

    if (!redisfetch) {
      return { message: "OTP Expired", code: 400 };
    }

    if (redisfetch.otp !== data.code) {
      return { message: "Invalid OTP", code: 400 };
    }

    RedisService.del(data.email);

    const insert = await prisma.user.create({
      data: {
        fullName: redisfetch.name,
        email: redisfetch.email,
        password: redisfetch.password,
      },
    });

    return insert.id;
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}

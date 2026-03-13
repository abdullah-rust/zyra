import { Signup } from "../../types/auth.types";
import { logger } from "../../utils/logger";
import { generateOTP } from "../../utils/generateOtp";
import { MailService } from "../mail/mail.service";
import { RedisService } from "../../lib/redis";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";

export async function signupService(
  data: Signup,
): Promise<{ message: string; code: number }> {
  try {
    const ifExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (ifExist) {
      return { message: "User Already Exist", code: 400 };
    }

    data.password = await hashPassword(data.password);

    const otp = generateOTP();
    MailService.sendOTP(data.email, otp);
    RedisService.set(data.email, { ...data, otp }, 300);

    return { message: "OTP Sent", code: 200 };
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}

import { Login } from "../../types/auth.types";
import { logger } from "../../utils/logger";
import { prisma } from "../../lib/prisma";
import { generateOTP } from "../../utils/generateOtp";
import { RedisService } from "../../lib/redis";
import { MailService } from "../mail/mail.service";
import { verifyPassword } from "../../utils/hash";

export async function loginService(
  data: Login,
): Promise<{ message: string; code: number }> {
  try {
    const ifExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!ifExist) {
      return { message: "User Not Found", code: 404 };
    }

    const checkPassword = await verifyPassword(data.password, ifExist.password);

    if (!checkPassword) {
      return { message: "Invalid Password", code: 400 };
    }
    const id = ifExist.id;

    const otp = generateOTP();
    MailService.sendOTP(data.email, otp);
    RedisService.set(data.email, { otp, id }, 300);

    return { message: "OTP Sent", code: 200 };
  } catch (err: any) {
    logger.error(err);
    return { message: "Internal Server Error", code: 500 };
  }
}

import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { otpScheme } from "../../types/auth.types";
import { LoginOtpService } from "../../service/auth/otps/login.otp.service";
import { CreateJWTService } from "../../service/auth/create.jwt.service";
import { SignupOtpService } from "../../service/auth/otps/signup.otp.service";
import { ForgotPasswordOtpService } from "../../service/auth/otps/forgetPsw.otp.service";

// cokkies options
const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function OTP(req: Request, res: Response) {
  try {
    const { data, error } = otpScheme.safeParse(req.body);

    if (error) {
      const message = error.issues[0].message;
      return res.status(400).json({ message });
    }

    // 1. Service Selection based on Type
    let result;
    if (data.otpType === "login") {
      result = await LoginOtpService(data);
    } else if (data.otpType === "signup") {
      result = await SignupOtpService(data);
    } else if (data.otpType === "forgotPassword") {
      result = await ForgotPasswordOtpService(data);
    }

    // 2. Handling Response
    if (typeof result === "string") {
      if (data.otpType === "login" || data.otpType === "signup") {
        const tokens = CreateJWTService(result);

        if (!tokens || typeof tokens === "boolean") {
          return res.status(500).json({ message: "internal server error" });
        }

        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

        return res.status(200).json({ message: `${data.otpType} Successful` });
      }

      return res.status(200).json({
        message: "OTP Verified. You can now change your password.",
        resetToken: result,
      });
    }

    if (typeof result === "object") {
      return res.status(result.code).json({ message: result.message });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

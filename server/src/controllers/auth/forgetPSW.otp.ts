import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { ChangePasswordScheme } from "../../types/auth.types";
import { PasswordChangeService } from "../../service/auth/otps/forgetPsw.otp.service";

export async function ChangePassword(req: Request, res: Response) {
  try {
    const { data, error } = ChangePasswordScheme.safeParse(req.body);

    if (error) {
      const message = error.issues[0].message;
      return res.status(400).json({ message });
    }

    const id = await PasswordChangeService(data);

    return res.status(id.code).json({ message: id.message });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

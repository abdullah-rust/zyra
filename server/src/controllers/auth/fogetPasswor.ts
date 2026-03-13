import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { forgotPasswordScheme } from "../../types/auth.types";
import { ForgetPasswordService } from "../../service/auth/forgetPsw.service";

export async function ForgetPassword(req: Request, res: Response) {
  try {
    const { data, error } = forgotPasswordScheme.safeParse(req.body);

    if (error) {
      const message = error.issues[0].message;
      return res.status(400).json({ message });
    }

    const result = await ForgetPasswordService(data);
    return res.status(result.code).json({ message: result.message });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

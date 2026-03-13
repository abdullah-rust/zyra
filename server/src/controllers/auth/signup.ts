import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { signupScheme } from "../../types/auth.types";
import { signupService } from "../../service/auth/signup.service";

export async function Signup(req: Request, res: Response) {
  try {
    const { data, error } = signupScheme.safeParse(req.body);

    if (error) {
      const message = error.issues[0].message;
      return res.status(400).json({ message });
    }

    const result = await signupService(data);
    return res.status(result.code).json({ message: result.message });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

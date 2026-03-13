import { Request, Response } from "express";
import { loginScheme } from "../../types/auth.types";
import { loginService } from "../../service/auth/login.service";
import { logger } from "../../utils/logger";

export async function login(req: Request, res: Response) {
  try {
    const { data, error } = loginScheme.safeParse(req.body);

    if (error) {
      const message = error.issues[0].message;
      return res.status(400).json({ message });
    }

    const result = await loginService(data);
    return res.status(result.code).json({ message: result.message });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

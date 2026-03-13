import { logger } from "../../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export function CreateJWTService(
  id: string,
): { accessToken: string; refreshToken: string } | boolean {
  try {
    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });

    return { accessToken, refreshToken };
  } catch (err: any) {
    logger.error(err);
    return false;
  }
}

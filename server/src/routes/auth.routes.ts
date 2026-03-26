import { Router } from "express";
import { login } from "../controllers/auth/login";
import { Signup } from "../controllers/auth/signup";
import { ForgetPassword } from "../controllers/auth/fogetPasswor";
import { OTP } from "../controllers/auth/otp";
import { ChangePassword } from "../controllers/auth/forgetPSW.otp";
import { rateLimit } from "express-rate-limit";
import { refreshTokenHandler } from "../controllers/auth/refreshToken";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message: "I've tried too many times. Try again in 15 minutes.",
    code: 429,
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post("/login", authLimiter, login);
authRouter.post("/signup", authLimiter, Signup);
authRouter.post("/forgot-password", authLimiter, ForgetPassword);
authRouter.post("/otp", authLimiter, OTP);
authRouter.post("/change-password", authLimiter, ChangePassword);
authRouter.get("/refresh", refreshTokenHandler);

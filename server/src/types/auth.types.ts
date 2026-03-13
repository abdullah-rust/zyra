import * as z from "zod";

export interface Login {
  email: string;
  password: string;
}

export interface Signup {
  name: string;
  email: string;
  password: string;
}

export interface OTP {
  email: string;
  code: string;
  otpType: "login" | "signup" | "forgotPassword";
}

export interface ForgotPassword {
  email: string;
}

export interface LoginOtpRedis {
  email: string;
  otp: string;
  id: string;
}

export interface SignupOtpRedis {
  email: string;
  otp: string;
  name: string;
  password: string;
}

export interface ForgotPasswordOtpRedis {
  email: string;
  otp: string;
  id: string;
}

export interface PasswordChange {
  email: string;
  newpassword: string;
  resettoken: string;
}

// schemes with zod
export const loginScheme = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupScheme = z.object({
  name: z.string().trim().min(6, "Name must be at least 6 characters"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const otpScheme = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().min(6, "Code must be at least 6 characters"),
  otpType: z.enum(["login", "signup", "forgotPassword"]),
});

export const forgotPasswordScheme = z.object({
  email: z.string().trim().email(),
});

export const ChangePasswordScheme = z.object({
  email: z.string().trim().email(),
  newpassword: z.string().min(8, "Password must be at least 8 characters"),
  resettoken: z.string().trim(),
});

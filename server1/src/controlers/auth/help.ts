import { Request, Response } from "express";
import z from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "The name must be at least 8 characters long." })
    .max(50, { message: "Name must not exceed 50 characters in length." }),

  username: z
    .string()
    .trim()
    .min(8, { message: "The usernamename must be at least 8 characters long." })
    .max(50, { message: "UserName must not exceed 50 characters in length." })
    .toLowerCase(),
  email: z.email({ message: "Your not perfect to match email" }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "The password must be at least 8 characters long." })
    .max(50, { message: "password must not exceed 50 characters in length." }),
});

export const LoginSchema = z.object({
  email: z
    .email({ message: "Your not perfect to match email" })
    .trim()
    .max(100, { message: "Email length does not exceed 100 characters." }),
  password: z
    .string()
    .trim()
    .min(8, { message: "The password must be at least 8 characters long." })
    .max(50, { message: "password must not exceed 50 characters in length." }),
});

export const CodeSchema = z.object({
  email: z
    .email({ message: "Your not perfect to match email" })
    .trim()
    .max(100, { message: "Email length does not exceed 100 characters." }),
  code: z
    .string()
    .trim()
    .min(6, {
      message: "The length of the code must be at least 6 characters.",
    })
    .max(6, {
      message: "The length of the code must be at least 6 characters.",
    }),
  typesubmit: z.enum(["login", "signup"]),
});

export function validateSignup(schema: typeof SignupSchema) {
  return (req: Request, res: Response, next: Function): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      return res
        .status(400)
        .json({ message: e.errors, error: "Your data is incomplete." });
    }
  };
}
export function validateLogin(schema: typeof LoginSchema) {
  return (req: Request, res: Response, next: Function): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      return res
        .status(400)
        .json({ message: e.errors, error: "Your data is incomplete." });
    }
  };
}

export function validatecode(schema: typeof CodeSchema) {
  return (req: Request, res: Response, next: Function): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      return res.status(400).json({
        message: e.errors,
        error: "Your data is incomplete.",
      });
    }
  };
}

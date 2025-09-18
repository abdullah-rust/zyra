import { Router, Request, Response } from "express";
import { Signup } from "../controlers/auth/signup";
import { Login } from "../controlers/auth/login";
import { OkLogin, OkSignup } from "../controlers/auth/codeVerification";
import {
  SignupSchema,
  LoginSchema,
  CodeSchema,
  validateLogin,
  validateSignup,
  validatecode,
} from "../controlers/auth/help";

import { CheckJwt } from "../middleware/jwtMiddleware";
import { getProfile } from "../profile/profile";
import { searchusers } from "../search/searchuser";
import { setusertoredis } from "../other/setusertoredis";
import { Logout } from "../other/logout";
import { refresh } from "../middleware/refreshtoken";

const router: Router = Router();

router.get("/hi", hi);
router.get("/setuser", setusertoredis);
router.get("/refresh", refresh);
router.get("/profile", CheckJwt, getProfile);
router.get("/logout", Logout);
router.post("/search", CheckJwt, searchusers);
router.post("/auth/signup", validateSignup(SignupSchema), Signup);
router.post("/auth/login", validateLogin(LoginSchema), Login);
router.post("/auth/code", validatecode(CodeSchema), OkLogin, OkSignup);

export default router;

// import multer from "multer";
// const upload = multer({ storage: multer.memoryStorage() });

async function hi(_req: Request, res: Response) {
  res.send("from router se");
}

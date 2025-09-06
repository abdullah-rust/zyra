import { Router } from "express";
import { validateBody, signup, userSchema } from "./auth/signup";
import { signin, userSchema2, validateBody2 } from "./auth/signin";
import {
  validateBody3,
  signinVerify,
  signupVerify,
  schema,
} from "./auth/handleVerification";
const router = Router();

router.post("/signup", validateBody(userSchema), signup);
router.post("/signin", validateBody2(userSchema2), signin);
router.post("/signin/code", validateBody3(schema), signinVerify);
router.post("/signup/code", validateBody3(schema), signupVerify);

export default router;

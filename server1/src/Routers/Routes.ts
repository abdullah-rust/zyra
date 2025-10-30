import { Router } from "express";
import AuthRoutes from "../Auth/Routes";
import { authLimiter } from "../middleware/limiter";
import { searchUsers } from "../Search/Search";
import { CheckJwt } from "../middleware/jwtMiddleware";
import { refresh } from "../middleware/refreshtoken";
import { getProfile } from "../profile/profile";

const router = Router();

router.use("/auth", authLimiter, AuthRoutes);
router.get("/search", CheckJwt, searchUsers);
router.get("/refresh", CheckJwt, refresh);
router.get("/profile", CheckJwt, getProfile);

export default router;

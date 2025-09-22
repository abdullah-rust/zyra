import { Router } from "express";
import { CheckJwt } from "../middleware/jwtMiddleware";
import { offlineMessages } from "../notification/offlineMessages";
const router = Router();

router.get("/offlinemsg", CheckJwt, offlineMessages);

export default router;

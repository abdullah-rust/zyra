import { Server } from "socket.io";
import { parse } from "cookie";
import { verifyAccessToken } from "../utils/jwt";
import { logger } from "../utils/logger";

// Refined Middleware Logic
export async function checkJwt(io: Server) {
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("AUTH_ERROR: No cookies"));
      }

      const cookies = parse(cookieHeader);
      const token = cookies.accessToken;

      if (!token) {
        return next(new Error("AUTH_ERROR: Token missing"));
      }

      const decoded: any = verifyAccessToken(token);

      if (!decoded) {
        return next(new Error("AUTH_ERROR: Invalid token"));
      }

      // Tip: Sirf ID save karne ke bajaye pura payload save karo
      // taake bad mein roles ya username access kar sako

      socket.data.user = decoded.id;
      next();
    } catch (err) {
      logger.error("JWT Middleware Error:", err);
      next(new Error("Internal Server Error"));
    }
  });
}

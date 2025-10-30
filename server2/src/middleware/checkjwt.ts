import { verifyAccessToken } from "../utils/jwt";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

export async function checkJwt(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) {
    return next(new Error("Authentication error: No cookies found hai."));
  }

  const cookieArray = cookies.split(";").map((c) => c.trim().split("="));
  const accessToken = cookieArray.find((c) => c[0] === "access_token")?.[1];
  const refreshToken = cookieArray.find((c) => c[0] === "refresh_token")?.[1];

  if (!accessToken || !refreshToken) {
    return next(new Error("aUthuntication Error Token missing"));
  }

  try {
    const decodeaccess = await verifyAccessToken(accessToken);

    if (decodeaccess) {
      (socket as any).user = {
        userId: decodeaccess.userId,
      };
      return next();
    } else {
      return next(new Error("access_token expire"));
    }
  } catch (e) {
    console.log("middleware Error", e);
    return next(new Error("Internal Server Error"));
  }
}

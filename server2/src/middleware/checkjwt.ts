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
        username: decodeaccess.username,
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

// try {
//   if (!accessToken) {
//     throw new Error("No access token provided.");
//   }
//   const userPayload = await verifyAccessToken(accessToken);
//   if (!userPayload) {
//   }
//   (socket as any).user = {};
//   next();
// } catch (accessError: any) {
//   if (accessError.name === "TokenExpiredError" && refreshToken) {
//     try {
//       const refreshPayload = await verifyRefreshToken(refreshToken);
//       if (refreshPayload) {
//         const newAccessToken = await createAccessToken(
//           refreshPayload.userId,
//           refreshPayload.username
//         );
//         (socket as any).handshake.auth.newAccessToken = newAccessToken;
//         (socket as any).user = refreshPayload;
//         return next();
//       }
//     } catch (refreshError) {
//       return next(new Error("Authentication error: Invalid refresh token."));
//     }
//   }
//   // Agar koi aur error hai (e.g. malformed token) ya refresh token nahi hai
//   return next(
//     new Error("Authentication error: Invalid or expired access token.")
//   );
// }

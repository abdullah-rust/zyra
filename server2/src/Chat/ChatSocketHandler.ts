import { Server, Socket } from "socket.io";
import { setOnlineUser, deleteOnlineUser } from "./outher";
import logger from "../logger";
import { getOfflineMessages } from "./getOfflineMessages";
import { handlePrivateMessage } from "./handlePrivateMessage";
import { getOfflineStatus } from "./HandleMessageStataus";
import { HandleStatus } from "./HandleMessageStataus";

/* ─────────────── Message Interface ─────────────── */
export interface Message {
  message_id: string; // unique per message (UUID or nanoid)
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: "text" | "image" | "file" | "video" | "audio";
  timestamp: string; // ISO 8601
  status: "sent" | "delivered" | "seen" | "failed";
  metadata?: Record<string, any>;
}

/* ─────────────── Main Chat Handler ─────────────── */
export default async function ChatHandler(io: Server, socket: Socket) {
  const userId = (socket as any).user.userId;

  // Step 1: Mark user online in Redis
  await setUserInRedis(socket, userId);

  // Step 2: Deliver any offline messages
  await getOfflineMessages(io, socket, userId);

  await getOfflineStatus(io, socket, userId);

  logger.info(`✅ User connected → userId: ${userId}, socketId: ${socket.id}`);

  HandleStatus(io, socket);
  // Step 3: Listen for private messages
  handlePrivateMessage(io, socket);

  // Step 4: Cleanup when user disconnects
  socket.on("disconnect", async () => {
    await deleteOnlineUser(userId);
    logger.info(`❌ User disconnected → ${userId}`);
  });
}

/* ─────────────── Helper: Register User in Redis ─────────────── */
async function setUserInRedis(socket: Socket, userId: string) {
  try {
    const set = await setOnlineUser(userId, socket.id);
    if (!set) throw new Error(`Failed to set user ${userId} in Redis`);
  } catch (err) {
    logger.error(`Redis Error: ${err}`);
    socket.emit("error", { message: "Internal Server Error" });
  }
}

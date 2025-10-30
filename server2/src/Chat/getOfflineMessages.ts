import redis from "../clients/redisClient";
import logger from "../logger";
import { Server, Socket } from "socket.io";
import { Message } from "./ChatSocketHandler";

/* ─────────────── Get Offline Messages ─────────────── */
export async function getOfflineMessages(
  io: Server,
  socket: Socket,
  userId: string
): Promise<void> {
  try {
    const key = `offline_msgs:${userId}`;
    const messages = await redis.lrange(key, 0, -1);

    if (messages.length === 0) {
      logger.info(`No offline messages for user ${userId}`);
      return;
    }

    // Parse all messages from Redis
    const parsedMessages = messages.map((msg) => JSON.parse(msg));

    // Emit each message to the connected socket
    for (const msg of parsedMessages) {
      io.to(socket.id).emit("chat_message", msg);
    }

    // Clear queue after delivery
    await redis.del(key);

    logger.info(
      `✅ Delivered ${messages.length} offline messages to user ${userId}`
    );
  } catch (e) {
    logger.error(`❌ getOfflineMessages Error for ${userId}: ${e}`);
  }
}

/* ─────────────── Store Offline Messages ─────────────── */
export async function setofflineMessages(
  userId: string,
  msg: Message
): Promise<boolean> {
  try {
    await redis.rpush(`offline_msgs:${userId}`, JSON.stringify(msg));
    return true;
  } catch (e) {
    logger.error(`❌ Redis setofflineMessages Error: ${e}`);
    return false;
  }
}

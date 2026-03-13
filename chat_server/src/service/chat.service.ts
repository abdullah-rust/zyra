import { Server, Socket } from "socket.io";
import { RedisService } from "../lib/redis";
import { logger } from "../utils/logger";
import { redisClient } from "../config/redispool";

export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: "text" | "image" | "file" | "video" | "audio";
  timestamp: string; // ISO 8601
  status: "sent" | "delivered" | "seen" | "failed";
  metadata?: Record<string, any>;
}

export async function Chat(io: Server) {
  io.on("connection", async (socket) => {
    logger.result(`User Connected: ${socket.id}`);
    logger.result(`User Id: ${socket.data.user}`);

    await RedisService.set(`user:${socket.data.user}`, { socketId: socket.id });

    await getOfflineMessages(io, socket, socket.data.user);
    await sendMessage(io, socket);

    socket.on("disconnect", () => {
      logger.result(`User Disconnected: ${socket.id}`);
      RedisService.del(`user:${socket.data.user}`);
    });
  });
}

async function sendMessage(io: Server, socket: Socket) {
  socket.on("send-message", async (data: Message) => {
    const receiverData: { socketId: string } | null = await RedisService.get(
      `user:${data.receiver_id}`,
    );

    if (receiverData) {
      io.to(receiverData.socketId).emit("received-message", data);
      logger.result(`Message delivered real-time to ${data.receiver_id}`);
    } else {
      logger.error(
        `User ${data.receiver_id} is offline. Message queued for DB.`,
      );
      await setofflineMessages(data.receiver_id, data);
    }
  });
}

export async function setofflineMessages(
  userId: string,
  msg: Message,
): Promise<boolean> {
  try {
    await redisClient.rpush(`offline_msgs:${userId}`, JSON.stringify(msg));
    return true;
  } catch (e) {
    logger.error(`❌ Redis setofflineMessages Error: ${e}`);
    return false;
  }
}

/* ─────────────── Get Offline Messages ─────────────── */
export async function getOfflineMessages(
  io: Server,
  socket: Socket,
  userId: string,
): Promise<void> {
  try {
    const key = `offline_msgs:${userId}`;
    const messages = await redisClient.lrange(key, 0, -1);

    if (messages.length === 0) {
      logger.result(`No offline messages for user ${userId}`);
      return;
    }

    // Parse all messages from Redis
    const parsedMessages = messages.map((msg) => JSON.parse(msg));

    // Emit each message to the connected socket
    for (const msg of parsedMessages) {
      io.to(socket.id).emit("received-message", msg);
    }

    // Clear queue after delivery
    await redisClient.del(key);

    logger.result(
      `✅ Delivered ${messages.length} offline messages to user ${userId}`,
    );
  } catch (e) {
    logger.error(`❌ getOfflineMessages Error for ${userId}: ${e}`);
  }
}

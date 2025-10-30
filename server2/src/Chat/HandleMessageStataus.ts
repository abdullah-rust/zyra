import { Server, Socket } from "socket.io";
import { getSocketId } from "./outher"; // your existing Redis functions
import logger from "../logger";
import redis from "../clients/redisClient";

interface MessageStatus {
  message_id: string;
  receiver_id: string;
  status: "delivered" | "seen";
}

export function HandleStatus(io: Server, socket: Socket) {
  try {
    socket.on("message_status", async (msg: MessageStatus) => {
      const socketId = await getSocketId(msg.receiver_id);
      if (socketId) {
        io.to(socketId.trim()).emit("message_status", msg);
      } else {
        await saveStatusOffline(msg);
      }
    });
  } catch (error) {
    logger.error(`❌ HandleStatus Error: ${error}`);
  }
}

export async function getOfflineStatus(
  io: Server,
  socket: Socket,
  userId: string
) {
  try {
    const key = `offline_status:${userId}`;
    const Statuses = await redis.lrange(key, 0, -1);

    if (Statuses.length === 0) {
      logger.info(`No offline messages for user ${userId}`);
      return;
    }
    const parsedStatuses = Statuses.map((sts) => JSON.parse(sts));

    for (const sts of parsedStatuses) {
      io.to(socket.id).emit("message_status", sts);
    }

    await redis.del(key);
  } catch (error) {
    logger.error(`❌ HandleStatus Offline Error: ${error}`);
  }
}

async function saveStatusOffline(msg: MessageStatus) {
  try {
    await redis.rpush(`offline_status:${msg.receiver_id}`, JSON.stringify(msg));
  } catch (e) {
    logger.error(`❌ Redis setofflineStatus Error: ${e}`);
  }
}

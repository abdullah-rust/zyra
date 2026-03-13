// worker.ts
import { prisma } from "../../lib/prisma";
import { RedisService } from "../../lib/redis";
import { IMessage } from "../../types/chat.types";
import { logger } from "../../utils/logger";

export async function DatabaseWorkerService() {
  logger.result("🚀 Database Worker started, listening for messages...");
  while (true) {
    try {
      const messages = await RedisService.lrange<IMessage>("chat_queue", 0, 49);

      if (messages.length > 0) {
        await prisma.message.createMany({
          data: messages.map((m) => ({
            senderId: m.senderId,
            receiverId: m.receiverId,
            content: m.content,
            isRead: false,
          })),
        });

        await RedisService.ltrim("chat_queue", messages.length, -1);

        logger.result(
          "✅ Processed and saved messages to DB:",
          messages.length,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error("❌ Database Worker Error:", error);
    }
  }
}

import { Server, Socket } from "socket.io";
import { Message } from "./ChatSocketHandler";
import { getSocketId } from "./outher";
import logger from "../logger";
import { setofflineMessages } from "./getOfflineMessages";

/* ─────────────── Private Chat (1-to-1 Messaging) ─────────────── */
export function handlePrivateMessage(io: Server, socket: Socket) {
  socket.on("chat_message", async (msg: Message) => {
    try {
      const receiverSocketId = await getSocketId(msg.receiver_id);

      if (!receiverSocketId) {
        logger.info(`📴 User offline → ${msg.receiver_id}`);
        await setofflineMessages(msg.receiver_id, msg);
        logger.info(
          `💾 Stored message ${msg.message_id} for offline user ${msg.receiver_id}`
        );
        return;
      }

      // Deliver message to receiver in real time
      io.to(receiverSocketId.trim()).emit("chat_message", msg);

      logger.info(
        `📨 Sent message ${msg.message_id} → receiver ${msg.receiver_id}`
      );
    } catch (err) {
      logger.error(`Error sending message: ${err}`);
      socket.emit("error", {
        message: "Message delivery failed",
        messageId: msg.message_id,
      });
    }
  });
}

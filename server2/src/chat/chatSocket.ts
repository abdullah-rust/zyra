process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import { Server, Socket } from "socket.io";
import { setOnlineUser, getSocketId, deleteOnlineUser } from "./outher";
import axios from "axios";

// Interface for messages
interface Message {
  message_id: string;
  message_status: string;
  sender_username: string;
  receiver_username: string;
  content: string;
  content_type: string;
  time_stamp?: string;
  sender_type: string;
  read?: boolean;
  username?: string;
}

export default async function ChatHandler(io: Server, socket: Socket) {
  console.log("⚡ User connected:", socket.id);
  const username = (socket as any).user.username;

  try {
    const setuser = await setOnlineUser(username, socket.id);
    if (!setuser) {
      console.error(`Failed to set user ${username} in Redis`);
      socket.emit("error", { message: "Internal server error" });
    }
  } catch (e) {
    console.error("Redis promise error:", e);
    socket.emit("error", { message: "Redis unavailable" });
  }

  socket.on("chat message", async (msg: Message) => {
    msg.time_stamp = new Date().toISOString();

    try {
      // 1. Check if receiver is online
      const receiverSocketId = await getSocketId(msg.receiver_username);
      const isOnline = !!receiverSocketId;

      // 2. Prepare message objects for both sender and receiver
      const senderMessage: Message = {
        ...msg,
        username: username,
        read: true,
      };

      const receiverMessage: Message = {
        ...msg,
        username: msg.receiver_username,
        read: isOnline, // ✅ Logic is here: True if online, False if offline
      };

      // 3. Emit message if receiver is online
      if (isOnline) {
        io.to(receiverSocketId.trim()).emit("chat message", msg);
        console.log(`User ${msg.receiver_username} is online, message sent.`);
      } else {
        console.log(`User ${msg.receiver_username} is offline`);
      }

      // 4. Send both messages to MessageVault in a single API call
      const res = await axios.post(
        "http://zyra.local/messagevault/add",
        receiverMessage
      );
      console.log(`MessageVault API status: ${res.status}`);
      const res2 = await axios.post(
        "http://zyra.local/messagevault/add",
        senderMessage
      );
      console.log(`MessageVault API status: ${res2.status}`);
    } catch (e) {
      console.error("Error sending message:", e);
      socket.emit("error", { message: "Message could not be delivered" });
    }
  });

  socket.on("disconnect", async () => {
    await deleteOnlineUser(username);
    console.log("❌ User disconnected:", socket.id);
  });
}

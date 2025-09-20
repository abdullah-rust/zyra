import { Server, Socket } from "socket.io";
import { setOnlineUser, getSocketId, deleteOnlineUser } from "./outher";

interface ChatMessage {
  toUsername: string;
  fromUsername: string;
  content: string;
  timestamp?: string;
  type: string;
}

export default async function ChatHandler(io: Server, socket: Socket) {
  console.log("⚡ User connected:", socket.id);
  let username = (socket as any).user.username;

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

  socket.on("chat message", async (msg: ChatMessage) => {
    msg.timestamp = new Date().toISOString();

    try {
      const socketId = await getSocketId(msg.toUsername);

      if (socketId == undefined) {
        console.error(`Failed to set user ${username} in Redis`);
        socket.emit("error", { message: "Internal server error" });
      }
      console.log(msg);

      if (socketId) {
        io.to(socketId.trim()).emit("chat message", msg);
      } else {
        console.log(`User ${msg.toUsername} is offline`);
      }
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

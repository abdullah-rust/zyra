import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../global/api";

const SOCKET_SERVER_URL = "zyra.local";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connectSocket = () => {
      const newSocket = io(SOCKET_SERVER_URL, {
        path: "/api/chat/chat",
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Socket connected successfully!");
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected.");
      });

      newSocket.on("connect_error", async (error) => {
        if (error.message.trim() === "access_token expire") {
          try {
            await api.get("/refresh");
            console.log("🔄 New access token set, reconnecting socket...");
            newSocket.close();
            connectSocket();
          } catch (e) {
            console.log("refresh token error", e);
          }
        }
        console.error("Connection Error:", error.message);
      });

      return newSocket;
    };

    const initialSocket = connectSocket();

    return () => {
      initialSocket.close();
    };
  }, []);

  return socket;
};

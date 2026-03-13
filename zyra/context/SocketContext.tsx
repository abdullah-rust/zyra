"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null; // Naya state error track karne ke liye
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Instance Create karein
    const socketInstance = io("/", {
      path: "/socket.io/",
      withCredentials: true,
      // Transports ko default rehne dein taake agar WS fail ho toh polling chale
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
    });

    // 2. Connection Success
    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected! ID:", socketInstance.id);
      setIsConnected(true);
      setError(null);
    });

    // 3. Connection Error (Middleware Fail hone par yahan error aayega)
    socketInstance.on("connect_error", (err) => {
      console.log("❌ Socket Connection Error:", err.message);
      setError(err.message); // Maslan: "Authentication error: No cookies found"
      setIsConnected(false);
    });

    // 4. Disconnect
    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Socket Disconnected. Reason:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {/* Visual Debugger: Sirf development mein nazar aayega */}
      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          padding: "10px",
          background: isConnected ? "#d4edda" : "#f8d7da",
          border: "1px solid #ccc",
          borderRadius: "5px",
          zIndex: 9999,
          fontSize: "12px",
          color: "#333",
        }}
      >
        <strong>Socket Status:</strong>{" "}
        {isConnected ? "Connected" : "Disconnected"} <br />
        {error && <small style={{ color: "red" }}>Error: {error}</small>}
      </div>

      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

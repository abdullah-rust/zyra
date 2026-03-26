"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import api from "@/global/api1";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
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

  // useRef isliye taake refresh loop se bacha ja sake
  const isRefreshing = useRef(false);

  const initSocket = useCallback(() => {
    const isLogin = localStorage.getItem("isLogin") === "true";

    if (!isLogin) {
      console.log("ℹ️ Socket: User not logged in.");
      return null;
    }

    const socketInstance = io("/", {
      path: "/socket.io/",
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected! ID:", socketInstance.id);
      setIsConnected(true);
      setError(null);
      isRefreshing.current = false; // Reset refresh flag on success
    });

    socketInstance.on("connect_error", async (err) => {
      console.error("❌ Socket Connection Error:", err.message);

      // Check if error is due to expired token (Backend should throw "Authentication error")
      if (
        err.message.includes("Authentication") ||
        err.message.includes("token")
      ) {
        if (!isRefreshing.current) {
          isRefreshing.current = true;
          try {
            console.log("🔄 Token expired, attempting silent refresh...");
            await api.get("/auth/refresh");

            // Refresh successful, purana socket urao aur naya banao
            socketInstance.disconnect();
            initSocket();
          } catch (refreshErr) {
            console.error("🚨 Refresh failed. Redirecting to login.");
            setError("Session expired. Please login again.");
            setIsConnected(false);
            // localStorage.setItem("isLogin", "false"); // Optional: Logout user
          }
        }
      } else {
        setError(err.message);
        setIsConnected(false);
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Socket Disconnected:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return socketInstance;
  }, []);

  useEffect(() => {
    const instance = initSocket();

    return () => {
      if (instance) instance.disconnect();
    };
  }, [initSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {/* Modern Status Badge */}
      <div className="socket-status-badge">
        <div
          className={`status-dot ${isConnected ? "online" : "offline"}`}
        ></div>
        <div className="status-text">
          <span className="label">{isConnected ? "Live" : "Offline"}</span>
          {error && <span className="error-msg">{error}</span>}
        </div>
      </div>

      <style jsx>{`
        .socket-status-badge {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(17, 27, 33, 0.85); /* Zyra Dark Theme match */
          backdrop-filter: blur(12px);
          border: 1px solid
            ${isConnected
              ? "rgba(74, 222, 128, 0.5)"
              : "rgba(251, 113, 133, 0.5)"};
          border-radius: 50px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
        }

        .status-dot.online {
          background: #22c55e;
          box-shadow: 0 0 12px #22c55e;
        }

        .status-dot.offline {
          background: #ef4444;
        }

        .online::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2.5s infinite;
        }

        .status-text {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-size: 12px;
          font-weight: 700;
          color: #e9edef;
          letter-spacing: 0.5px;
        }
        .error-msg {
          font-size: 9px;
          color: #fb7185;
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          70% {
            transform: scale(2.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .socket-status-badge {
            bottom: 15px;
            right: 15px;
            padding: 6px 12px;
          }
        }
      `}</style>

      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

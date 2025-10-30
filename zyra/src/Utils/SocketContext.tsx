import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../global/useSocket";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

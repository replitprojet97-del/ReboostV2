import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  error: string | null;
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    const handleConnect = () => {
      setConnected(true);
      setError(null);
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    };

    const handleConnectError = (err: Error) => {
      setError(err.message);
      setConnected(false);
    };

    const handleReconnect = (attemptNumber: number) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setConnected(true);
      setError(null);
    };

    const handleReconnectError = (err: Error) => {
      setError(`Reconnection error: ${err.message}`);
    };

    const handleReconnectFailed = () => {
      setError("Failed to reconnect after maximum attempts");
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);
    socketInstance.on("reconnect", handleReconnect);
    socketInstance.on("reconnect_error", handleReconnectError);
    socketInstance.on("reconnect_failed", handleReconnectFailed);

    if (socketInstance.connected) {
      setConnected(true);
    }

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.off("reconnect", handleReconnect);
      socketInstance.off("reconnect_error", handleReconnectError);
      socketInstance.off("reconnect_failed", handleReconnectFailed);
    };
  }, []);

  return { socket, connected, error };
}

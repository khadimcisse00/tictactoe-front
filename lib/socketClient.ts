import { io, Socket } from "socket.io-client";

let socketClient: Socket | null = null;

export function obtenirSocketClient(): Socket {
  if (!socketClient) {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    socketClient = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socketClient.on("connect", () => {
      console.log("✓ Connecté au serveur Socket.IO");
    });

    socketClient.on("connect_error", (error) => {
      console.error("✗ Erreur Socket.IO :", error.message);
    });

    socketClient.on("disconnect", () => {
      console.log("✗ Déconnecté du serveur Socket.IO");
    });
  }

  return socketClient;
}

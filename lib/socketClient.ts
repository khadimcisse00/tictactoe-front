import { io, Socket } from "socket.io-client";

let socketClient: Socket | null = null;

export function obtenirSocketClient() {
  // En production, si aucun serveur Socket n’est défini → on désactive
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SOCKET_URL) {
    return null;
  }

  if (!socketClient) {
    const socketUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SOCKET_URL
        : "http://localhost:3001";

    if (!socketUrl) {
      return null;
    }

    socketClient = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketClient.on("connect", () => {
      console.log("✓ Connecté au serveur Socket.IO");
    });

    socketClient.on("connect_error", (error) => {
      console.error("✗ Erreur de connexion Socket.IO:", error.message);
    });

    socketClient.on("disconnect", (reason) => {
      console.log("✗ Déconnecté du serveur Socket.IO:", reason);
    });
  }

  return socketClient;
}

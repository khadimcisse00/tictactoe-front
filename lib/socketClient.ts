import { io, Socket } from "socket.io-client";

let socketClient: Socket | null = null;

export function obtenirSocketClient() {
  if (!socketClient) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
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
      console.error("Assurez-vous que le serveur Socket.IO est démarré sur", socketUrl);
    });

    socketClient.on("disconnect", (reason) => {
      console.log("✗ Déconnecté du serveur Socket.IO:", reason);
    });
  }
  return socketClient;
}

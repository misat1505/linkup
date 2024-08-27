import { Server, Socket } from "socket.io";
import { Message } from "../types/Message";
import { JwtHandler } from "./JwtHandler";
import { ChatService } from "../services/ChatService";

const getCookie = (
  cookieString: string | undefined,
  name: string
): string | null => {
  if (cookieString === undefined) return null;

  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((part) => part.trim());
    if (key === name) {
      return value;
    }
  }
  return null;
};

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("send-message", (message: Message, room: string) => {
      socket.to(room).emit("receive-message", message);
    });

    socket.on("join-room", async (room: string) => {
      try {
        const token = getCookie(socket.handshake.headers.cookie, "token");
        if (!token) throw new Error("Token is required to join room.");

        const decoded = JwtHandler.decode(token);
        if (!decoded) throw new Error("Invalid token.");

        const { userId } = decoded;
        const isAuthorized = await ChatService.isUserInChat({
          userId,
          chatId: room,
        });

        if (!isAuthorized)
          throw new Error("You are not authorized to join this room.");

        socket.join(room);
      } catch (e: any) {
        socket.emit("joining-room-error", e.message);
      }
    });

    socket.on("leave-room", (room: string) => {
      socket.leave(room);
    });
  });
};

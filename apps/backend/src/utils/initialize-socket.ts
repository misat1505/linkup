import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "@/config/env";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("send-message", (message, room) => {
      socket.to(room).emit("receive-message", message);
    });

    socket.on("send-reaction", (reaction, room) => {
      socket.to(room).emit("receive-reaction", reaction);
    });

    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("leave-room", (room) => {
      socket.leave(room);
    });
  });
};

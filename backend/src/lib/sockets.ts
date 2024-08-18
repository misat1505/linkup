import { Server, Socket } from "socket.io";
import { Message } from "../models/Message";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("send-message", (message: Message, room: string) => {
      socket.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (room: string) => {
      socket.join(room);
    });

    socket.on("leave-room", (room: string) => {
      socket.leave(room);
    });
  });
};

import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(","),
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

  socket.on("join-room", async (room) => {
    socket.join(room);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
  });
});

const port = Number(process.env.PORT);

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}.`);
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
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

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}.`);
});

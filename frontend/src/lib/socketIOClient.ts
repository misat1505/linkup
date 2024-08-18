import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../constants";
import { Message } from "../models/Message";

type Room = string;

export enum SocketAction {
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message"
}

class SocketClient {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log(`Connected to server with id: ${this.socket.id}`);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log(`Disconnected from server: ${reason}`);
    });
  }

  joinRoom(room: Room) {
    this.socket.emit(SocketAction.JOIN_ROOM, room);
  }

  leaveRoom(room: Room) {
    this.socket.emit(SocketAction.LEAVE_ROOM, room);
  }

  sendMessage(message: Message, room: Room) {
    this.socket.emit(SocketAction.SEND_MESSAGE, message, room);
  }

  onReceiveMessage(callback: (message: Message) => void) {
    this.socket.on(SocketAction.RECEIVE_MESSAGE, callback);
  }

  off(action: SocketAction) {
    this.socket.off(action);
  }
}

export const socketClient = new SocketClient(SOCKET_URL);

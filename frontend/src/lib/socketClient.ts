import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../constants";
import { Message } from "../types/Message";
import { convertDates } from "../utils/convertDates";

type Room = string;

export enum SocketAction {
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message"
}

export enum SocketErrors {
  JOINING_ROOM_ERROR = "joining-room-error"
}

class SocketClient {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl, { withCredentials: true });

    this.socket.on("connect", () => {
      console.log("Connected to socket.");
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("Disconnected from socket.");
    });
  }

  joinRoom(room: Room) {
    this.socket.emit(SocketAction.JOIN_ROOM, room);
  }

  leaveRoom(room: Room) {
    this.socket.emit(SocketAction.LEAVE_ROOM, room);
  }

  sendMessage(message: Message) {
    this.socket.emit(SocketAction.SEND_MESSAGE, message, message.chatId);
  }

  onReceiveMessage(callback: (message: Message) => void) {
    this.socket.on(SocketAction.RECEIVE_MESSAGE, (dirtyMessage: any) => {
      const convertedMessage = convertDates(dirtyMessage) as any;
      const message: Message = convertedMessage;
      callback(message);
    });
  }

  on(action: SocketAction | SocketErrors, cb: (...args: any[]) => void) {
    this.socket.on(action, cb);
  }

  off(action: SocketAction) {
    this.socket.off(action);
  }
}

export const socketClient = new SocketClient(SOCKET_URL);

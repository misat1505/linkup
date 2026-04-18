import { SOCKET_URL } from "@/constants";
import { convertDates } from "@/utils/convertDates";
import { Chat, Message, Reaction } from "@packages/schemas";
import { io, Socket } from "socket.io-client";

type Room = string;

export enum SocketAction {
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message",
  SEND_REACTION = "send-reaction",
  RECEIVE_REACTION = "receive-reaction",
}

export enum SocketErrors {
  JOINING_ROOM_ERROR = "joining-room-error",
}

class SocketClient {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log("Connected to socket.");
    });

    this.socket.on("disconnect", () => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on(SocketAction.RECEIVE_MESSAGE, (dirtyMessage: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedMessage = convertDates(dirtyMessage) as any;
      const message: Message = convertedMessage;
      callback(message);
    });
  }

  sendReaction(reaction: Reaction, chatId: Chat["id"]) {
    this.socket.emit(SocketAction.SEND_REACTION, reaction, chatId);
  }

  onReceiveReaction(callback: (reaction: Reaction) => void) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on(SocketAction.RECEIVE_REACTION, (reaction: any) => {
      callback(reaction);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(action: SocketAction | SocketErrors, cb: (...args: any[]) => void) {
    this.socket.on(action, cb);
  }

  off(action: SocketAction) {
    this.socket.off(action);
  }
}

export const socketClient = new SocketClient(SOCKET_URL);

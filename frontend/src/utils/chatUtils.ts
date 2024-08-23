import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { createFullName } from "./createFullName";
import { getInitials } from "./getInitials";

export class ChatUtils {
  private chat: Chat;
  private me: User;

  constructor(chat: Chat, me: User) {
    this.chat = chat;
    this.me = me;
  }

  private getOtherUser(): User | null {
    if (this.chat.type === "PRIVATE") {
      return this.chat.users?.find((user) => user.id !== this.me.id) || null;
    }
    return null;
  }

  public getImageURL(): User["photoURL"] | null {
    if (this.chat.type === "PRIVATE") {
      if (
        this.chat.users?.length === 1 &&
        this.chat.users![0].id === this.me.id
      ) {
        return this.me.photoURL;
      }
      return this.getOtherUser()?.photoURL || null;
    }
    if (this.chat.type === "GROUP" && this.chat.photoURL) {
      return this.chat.photoURL;
    }
    return null;
  }

  public getChatName(): string {
    if (this.chat.type === "PRIVATE") {
      if (
        this.chat.users?.length === 1 &&
        this.chat.users![0].id === this.me.id
      ) {
        return createFullName({
          firstName: this.me.firstName,
          lastName: this.me.lastName
        });
      }
      const otherUser = this.getOtherUser();
      if (otherUser) {
        return createFullName({
          firstName: otherUser.firstName,
          lastName: otherUser.lastName
        });
      }
    }
    if (this.chat.type === "GROUP") {
      if (this.chat.name) {
        return this.chat.name;
      }
      const names = this.chat.users?.map(
        (user) => `${user.firstName} ${user.lastName}`
      );
      return names?.join(", ") || "";
    }
    return "";
  }

  public getImageAlt(): string {
    if (this.chat.type === "PRIVATE") {
      if (
        this.chat.users?.length === 1 &&
        this.chat.users![0].id === this.me.id
      ) {
        return getInitials({
          firstName: this.me.firstName,
          lastName: this.me.lastName
        });
      }
      const otherUser = this.getOtherUser();
      if (otherUser) {
        return getInitials({
          firstName: otherUser.firstName,
          lastName: otherUser.lastName
        });
      }
    }
    return "";
  }

  public getLastActive(): User["lastActive"] {
    if (this.chat.type === "PRIVATE") {
      if (
        this.chat.users?.length === 1 &&
        this.chat.users![0].id === this.me.id
      ) {
        return this.me.lastActive;
      }
      const otherUser = this.getOtherUser();
      if (otherUser) {
        return otherUser.lastActive;
      }
    }
    return new Date();
  }
}

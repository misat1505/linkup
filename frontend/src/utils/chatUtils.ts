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
        return createFullName(this.me);
      }
      const otherUser = this.getOtherUser();
      if (otherUser) {
        return createFullName(otherUser);
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
        return getInitials(this.me);
      }
      const otherUser = this.getOtherUser();
      if (otherUser) {
        return getInitials(otherUser);
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
    if (this.chat.type === "GROUP") {
      const otherUsers = this.chat.users!.filter((u) => u.id !== this.me.id);

      let lastActive = new Date(1970, 1, 1);
      for (const user of otherUsers) {
        if (user.lastActive.getTime() > lastActive.getTime())
          lastActive = user.lastActive;
      }
      return lastActive;
    }
    return new Date();
  }
}

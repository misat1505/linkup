import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { createFullName } from "./createFullName";
import { getInitials } from "./getInitials";

type CommonArgs = {
  chat: Chat;
  me: User;
};

export function getImageURL({ chat, me }: CommonArgs): User["photoURL"] {
  if (chat.type === "PRIVATE") {
    if (chat.users?.length === 1 && chat.users![0].id === me.id)
      return me.photoURL;
    const otherUser = chat.users!.find((user) => user.id !== me.id);
    return otherUser!.photoURL;
  }
  return null;
}

export function getChatName({ chat, me }: CommonArgs): string {
  if (chat.type === "PRIVATE") {
    if (chat.users?.length === 1 && chat.users![0].id === me.id)
      return createFullName({
        firstName: me.firstName,
        lastName: me.lastName
      });

    const otherUser = chat.users!.find((user) => user.id !== me.id)!;
    return createFullName({
      firstName: otherUser.firstName,
      lastName: otherUser.lastName
    });
  }
  return "";
}

export function getImageAlt({ chat, me }: CommonArgs): string {
  if (chat.type === "PRIVATE") {
    if (chat.users?.length === 1 && chat.users![0].id === me!.id)
      return getInitials({ firstName: me.firstName, lastName: me.lastName });

    const otherUser = chat.users!.find((user) => user.id !== me!.id)!;
    return getInitials({
      firstName: otherUser.firstName,
      lastName: otherUser.lastName
    });
  }
  return "";
}

export function getLastActive({ chat, me }: CommonArgs): User["lastActive"] {
  if (chat.type === "PRIVATE") {
    if (chat.users?.length === 1 && chat.users![0].id === me.id)
      return chat.users![0].lastActive;

    const otherUser = chat.users!.find((user) => user.id !== me.id)!;
    return otherUser.lastActive;
  }
  return new Date();
}

import { Message } from "../models/Message";

export function isShowingAvatar(
  messages: Message[],
  currentMessage: Message
): boolean {
  const messageIdx = messages.findIndex((m) => m.id === currentMessage.id);
  if (messageIdx === messages.length - 1) return true;

  const nextMessage = messages[messageIdx + 1];
  return currentMessage.author.id !== nextMessage.author.id;
}

import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./DELETE_chats-chatId-users.spec";
import "./GET_chats-chatId-message.spec";
import "./GET_chats-reactions.spec";
import "./GET_chats.spec";
import "./POST_chat-private.spec";
import "./POST_chats-chatId-messages.spec";
import "./POST_chats-chatId-reactions.spec";
import "./POST_chats-chatId-users.spec";
import "./POST_chats-group.spec";
import "./PUT_chats-chatId-users-userId-alias.spec";
import "./PUT_chats-chatId.spec";

import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./delete_chats-chat-id-users.spec";
import "./get_chats-chat-id-message.spec";
import "./get_chats-reactions.spec";
import "./get_chats.spec";
import "./post_chat-private.spec";
import "./post_chats-chat-id-messages.spec";
import "./post_chats-chat-id-reactions.spec";
import "./post_chats-chat-id-users.spec";
import "./post_chats-group.spec";
import "./put_chats-chat-id-users-user-id-alias.spec";
import "./put_chats-chat-id.spec";

import { Reaction } from "../../src/types/Reaction";
import { ChatService } from "../../src/services/ChatService";
import { testWithTransaction } from "../utils/testWithTransaction";
import { Chat, UserInChat } from "../../src/types/Chat";
import { Message } from "../../src/types/Message";

describe("ChatService", () => {
  describe("updateGroupChat", () => {
    it("updates group chat details", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const name = "new name";
        const file = "path.jpg";

        const result = await chatService.updateGroupChat({
          chatId,
          name,
          file,
        });

        Chat.strict().parse(result);
        expect(result?.photoURL).toBe(file);
        expect(result?.name).toBe(name);
      });
    });

    it("handles null input values gracefully", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const name = null;
        const file = null;

        const result = await chatService.updateGroupChat({
          chatId,
          name,
          file,
        });

        Chat.strict().parse(result);
        expect(result?.photoURL).toBeNull();
        expect(result?.name).toBeNull();
      });
    });
  });

  describe("deleteFromChat", () => {
    it("removes user from chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const userId = seed.users[0].id;

        await chatService.deleteFromChat({ chatId, userId });

        const chats = await chatService.getUserChats(userId);
        const chat = chats.find((c) => c.id === chatId);
        expect(chat).toBeUndefined();
      });
    });
  });

  describe("getChatType", () => {
    it("retrieves chat type", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;

        const result = await chatService.getChatType(chatId);

        expect(result).toBe("GROUP");
      });
    });

    it("returns null for non-existent chat", async () => {
      await testWithTransaction(async ({ tx }) => {
        const chatService = new ChatService(tx);
        const chatId = "non-existent";

        const result = await chatService.getChatType(chatId);
        expect(result).toBeNull();
      });
    });
  });

  describe("addUserToChat", () => {
    it("adds user to chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const userId = seed.users[1].id;

        const result = await chatService.addUserToChat({
          chatId,
          userId,
        });

        UserInChat.strict().parse(result);

        const chats = await chatService.getUserChats(seed.users[0].id);
        const chat = chats.find((c) => c.id === chatId)!;
        const user = chat.users?.find((u) => u.id === userId);
        UserInChat.strict().parse(user);
      });
    });
  });

  describe("updateAlias", () => {
    it("updates user alias in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const userId = seed.users[0].id;
        const alias = "new alias";

        await chatService.updateAlias({
          chatId,
          userId,
          alias,
        });

        const chats = await chatService.getUserChats(userId);
        const chat = chats.find((c) => c.id === chatId)!;
        const user = chat.users?.find((u) => u.id === userId);
        expect(user?.alias).toBe(alias);
        UserInChat.strict().parse(user);
      });
    });
  });

  describe("createReactionToMessage", () => {
    it("creates message reaction", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const reaction: Reaction = await chatService.createReactionToMessage({
          userId: seed.users[0].id,
          messageId: seed.messages[1].id,
          reactionId: seed.reactions[0].id,
        });

        Reaction.strict().parse(reaction);
        expect(reaction).toEqual({
          id: seed.reactions[0].id,
          name: "happy",
          messageId: seed.messages[1].id,
          user: expect.any(Object),
        });
      });
    });
  });

  describe("isMessageInChat", () => {
    it("confirms message belongs to chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isMessageInChat({
          chatId: seed.chats[1].id,
          messageId: seed.messages[1].id,
        });

        expect(result).toBeTruthy();
      });
    });

    it("denies message belongs to chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isMessageInChat({
          chatId: seed.chats[1].id,
          messageId: seed.messages[0].id,
        });

        expect(result).toBeFalsy();
      });
    });
  });

  describe("getChatMessages", () => {
    it("retrieves messages for specified chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getChatMessages(seed.chats[0].id);

        expect(result.length).toBe(1);
        result.forEach((message) => {
          Message.strict().parse(message);
        });

        const message = result[0];
        expect(message.id).toBe(seed.messages[0].id);
        expect(message.reactions.length).toBe(1);
      });
    });
  });

  describe("isUserInChat", () => {
    it("confirms user is in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: seed.chats[1].id,
          userId: seed.users[0].id,
        });

        expect(result).toBeTruthy();
      });
    });

    it("denies user is in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: seed.chats[1].id,
          userId: seed.users[1].id,
        });

        expect(result).toBeFalsy();
      });
    });

    it("returns true for non-existent chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: "63256",
          userId: seed.users[0].id,
        });

        expect(result).toBeFalsy();
      });
    });
  });

  describe("createMessage", () => {
    it("creates new message in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const message = await chatService.createMessage({
          content: "text",
          authorId: seed.users[0].id,
          chatId: seed.chats[1].id,
          files: ["file1.webp"],
          responseId: seed.messages[1].id,
        });

        Message.strict().parse(message);
      });
    });
  });

  describe("getUserChats", () => {
    it("retrieves all chats for user", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chats = await chatService.getUserChats(seed.users[0].id);

        expect(chats.length).toBe(2);
        chats.forEach((chat) => {
          Chat.strict().parse(chat);
        });
      });
    });
  });

  describe("getPrivateChatByUserIds", () => {
    it("retrieves existing private chat by user IDs", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getPrivateChatByUserIds(
          seed.users[1].id,
          seed.users[0].id
        );

        Chat.strict().parse(result);
      });
    });

    it("returns null for non-existent private chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getPrivateChatByUserIds(
          seed.users[1].id,
          seed.users[1].id
        );

        expect(result).toBeNull();
      });
    });
  });

  describe("createPrivateChat", () => {
    it("creates new private chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.createPrivateChat(
          seed.users[1].id,
          seed.users[0].id
        );

        Chat.strict().parse(result);
        expect(result.type).toBe("PRIVATE");
      });
    });
  });

  describe("createGroupChat", () => {
    it("creates new group chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.createGroupChat(
          [seed.users[1].id],
          "name",
          "photo.webp"
        );

        Chat.strict().parse(result);
        expect(result.name).toBe("name");
        expect(result.photoURL).toBe("photo.webp");
        expect(result.type).toBe("GROUP");
      });
    });
  });

  describe("getChatById", () => {
    it("retrieves chat by ID", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getChatById(seed.chats[0].id);
        Chat.strict().parse(result);
      });
    });

    it("returns null for non-existent chat ID", async () => {
      await testWithTransaction(async ({ tx }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getChatById("non-existent");
        expect(result).toBeNull();
      });
    });
  });

  describe("getPostChatMessages", () => {
    it("retrieves post-related chat messages by ID", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        await chatService.createMessage({
          content: "message",
          authorId: seed.users[0].id,
          chatId: seed.posts[0].chat.id,
          files: [],
          responseId: null,
        });

        const result = await chatService.getPostChatMessages(
          seed.chats[0].id,
          null
        );
        expect(result.length).toBe(1);
        result.forEach((message) => {
          Message.strict().parse(message);
        });
      });
    });
  });
});

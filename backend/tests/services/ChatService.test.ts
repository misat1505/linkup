import { Reaction } from "../../src/types/Reaction";
import { ChatService } from "../../src/services/ChatService";
import { isReaction } from "../../src/types/guards/reaction.guard";
import { isMessage } from "../../src/types/guards/message.guard";
import { isChat } from "../../src/types/guards/chat.guard";
import { isUserInChat } from "../../src/types/guards/user.guard";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("ChatService", () => {
  describe("updateGroupChat", () => {
    it("should update group chat", async () => {
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

        expect(isChat(result)).toBe(true);
        expect(result?.photoURL).toBe(file);
        expect(result?.name).toBe(name);
      });
    });

    it("should handle null values", async () => {
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

        expect(isChat(result)).toBe(true);
        expect(result?.photoURL).toBeNull();
        expect(result?.name).toBeNull();
      });
    });
  });

  describe("deleteFromChat", () => {
    it("should delete user from chat", async () => {
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
    it("should get chat type", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;

        const result = await chatService.getChatType(chatId);

        expect(result).toBe("GROUP");
      });
    });
  });

  describe("addUserToChat", () => {
    it("should add user to chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chatId = seed.chats[1].id;
        const userId = seed.users[1].id;

        const result = await chatService.addUserToChat({
          chatId,
          userId,
        });

        expect(isUserInChat(result)).toBe(true);

        const chats = await chatService.getUserChats(seed.users[0].id);
        const chat = chats.find((c) => c.id === chatId)!;
        const user = chat.users?.find((u) => u.id === userId);
        expect(isUserInChat(user)).toBe(true);
      });
    });
  });

  describe("updateAlias", () => {
    it("should update alias", async () => {
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
        expect(isUserInChat(user)).toBe(true);
      });
    });
  });

  describe("createReactionToMessage", () => {
    it("should create a reaction", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const reaction: Reaction = await chatService.createReactionToMessage({
          userId: seed.users[0].id,
          messageId: seed.messages[1].id,
          reactionId: seed.reactions[0].id,
        });

        expect(isReaction(reaction)).toBe(true);
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
    it("should return true if message is in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isMessageInChat({
          chatId: seed.chats[1].id,
          messageId: seed.messages[1].id,
        });

        expect(result).toBe(true);
      });
    });

    it("should return false if message is not in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isMessageInChat({
          chatId: seed.chats[1].id,
          messageId: seed.messages[0].id,
        });

        expect(result).toBe(false);
      });
    });
  });

  describe("getChatMessages", () => {
    it("should return messages from the given chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getChatMessages(seed.chats[0].id);

        expect(result.length).toBe(1);
        result.forEach((message) => {
          expect(isMessage(message)).toBe(true);
        });

        const message = result[0];
        expect(message.id).toBe(seed.messages[0].id);
        expect(message.reactions.length).toBe(1);
      });
    });
  });

  describe("isUserInChat", () => {
    it("should return true if user is in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: seed.chats[1].id,
          userId: seed.users[0].id,
        });

        expect(result).toBe(true);
      });
    });

    it("should return false if user is not in chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: seed.chats[1].id,
          userId: seed.users[1].id,
        });

        expect(result).toBe(false);
      });
    });

    it("should return true if chat doesnt exist", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.isUserInChat({
          chatId: "63256",
          userId: seed.users[0].id,
        });

        expect(result).toBe(false);
      });
    });
  });

  describe("createMessage", () => {
    it("should create a message", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const message = await chatService.createMessage({
          content: "text",
          authorId: seed.users[0].id,
          chatId: seed.chats[1].id,
          files: ["file1.webp"],
          responseId: seed.messages[1].id,
        });

        expect(isMessage(message)).toBe(true);
      });
    });
  });

  describe("getUserChats", () => {
    it("should return user chats", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const chats = await chatService.getUserChats(seed.users[0].id);

        expect(chats.length).toBe(2);
        chats.forEach((chat) => {
          expect(isChat(chat)).toBe(true);
        });
      });
    });
  });

  describe("getPrivateChatByUserIds", () => {
    it("should get chat if exists", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getPrivateChatByUserIds(
          seed.users[1].id,
          seed.users[0].id
        );

        expect(isChat(result)).toBe(true);
      });
    });

    it("should return null if chat doesnt exist", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.getPrivateChatByUserIds(
          seed.users[1].id,
          seed.users[1].id
        );

        expect(result).toBe(null);
      });
    });
  });

  describe("createPrivateChat", () => {
    it("should create private chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.createPrivateChat(
          seed.users[1].id,
          seed.users[0].id
        );

        expect(isChat(result)).toBe(true);
        expect(result.type).toBe("PRIVATE");
      });
    });
  });

  describe("createGroupChat", () => {
    it("should create group chat", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const chatService = new ChatService(tx);
        const result = await chatService.createGroupChat(
          [seed.users[1].id],
          "name",
          "photo.webp"
        );

        expect(isChat(result)).toBe(true);
        expect(result.name).toBe("name");
        expect(result.photoURL).toBe("photo.webp");
        expect(result.type).toBe("GROUP");
      });
    });
  });
});

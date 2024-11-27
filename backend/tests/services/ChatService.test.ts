import { Reaction } from "../../src/types/Reaction";
import { ChatService } from "../../src/services/ChatService";
import { isReaction } from "../../src/types/guards/reaction.guard";
import { isMessage } from "../../src/types/guards/message.guard";
import { isChat } from "../../src/types/guards/chat.guard";
import { USER } from "../utils/constants";
import { isUserInChat } from "../../src/types/guards/user.guard";

describe("ChatService", () => {
  describe("updateGroupChat", () => {
    it("should update group chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const name = "new name";
      const file = "path.jpg";

      const result = await ChatService.updateGroupChat({ chatId, name, file });

      expect(isChat(result)).toBe(true);
      expect(result?.photoURL).toBe(file);
      expect(result?.name).toBe(name);
    });

    it("should handle null values", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const name = null;
      const file = null;

      const result = await ChatService.updateGroupChat({ chatId, name, file });

      expect(isChat(result)).toBe(true);
      expect(result?.photoURL).toBeNull();
      expect(result?.name).toBeNull();
    });
  });

  describe("deleteFromChat", () => {
    it("should delete user from chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const userId = USER.id;

      await ChatService.deleteFromChat({ chatId, userId });

      const chats = await ChatService.getUserChats(USER.id);
      const chat = chats.find((c) => c.id === chatId);
      expect(chat).toBeUndefined();
    });
  });

  describe("getChatType", () => {
    it("should get chat type", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";

      const result = await ChatService.getChatType(chatId);

      expect(result).toBe("GROUP");
    });
  });

  describe("addUserToChat", () => {
    it("should add user to chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const userId = "935719fa-05c4-42c4-9b02-2be3fefb6e61";

      const result = await ChatService.addUserToChat({
        chatId,
        userId,
      });

      expect(isUserInChat(result)).toBe(true);

      const chats = await ChatService.getUserChats(USER.id);
      const chat = chats.find((c) => c.id === chatId)!;
      const user = chat.users?.find((u) => u.id === userId);
      expect(isUserInChat(user)).toBe(true);
    });
  });

  describe("updateAlias", () => {
    it("should update alias", async () => {
      const chatId = "74c78678-40b2-44cf-8436-fdc762480e92";
      const alias = "new alias";

      await ChatService.updateAlias({
        chatId,
        userId: USER.id,
        alias,
      });

      const chats = await ChatService.getUserChats(USER.id);
      const chat = chats.find((c) => c.id === chatId)!;
      const user = chat.users?.find((u) => u.id === USER.id);
      expect(user?.alias).toBe(alias);
      expect(isUserInChat(user)).toBe(true);
    });
  });

  describe("createReactionToMessage", () => {
    it("should create a reaction", async () => {
      const reaction: Reaction = await ChatService.createReactionToMessage({
        userId: "3daf7676-ec0f-4548-85a7-67b4382166d4",
        messageId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
        reactionId: "c3dd47c4-2192-4926-8ec0-b822d14b288d",
      });

      expect(isReaction(reaction)).toBe(true);
      expect(reaction).toEqual({
        id: "c3dd47c4-2192-4926-8ec0-b822d14b288d",
        name: "happy",
        messageId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
        user: expect.any(Object),
      });
    });
  });

  describe("isMessageInChat", () => {
    it("should return true if message is in chat", async () => {
      const result = await ChatService.isMessageInChat({
        chatId: "49794983-95cb-4ff1-b90b-8b393e86fd85",
        messageId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
      });

      expect(result).toBe(true);
    });

    it("should return false if message is not in chat", async () => {
      const result = await ChatService.isMessageInChat({
        chatId: "49794983-95cb-4ff1-b90b-8b393e86fd85",
        messageId: "01918dfb-ddd4-7e01-84df-1c8321cc9852",
      });

      expect(result).toBe(false);
    });
  });

  describe("getChatMessages", () => {
    it("should return messages from the given chat", async () => {
      const result = await ChatService.getChatMessages(
        "74c78678-40b2-44cf-8436-fdc762480e92"
      );

      expect(result.length).toBe(1);
      result.forEach((message) => {
        expect(isMessage(message)).toBe(true);
      });

      const message = result[0];
      expect(message.id).toBe("01918dfb-ddd4-7e01-84df-1c8321cc9852");
      expect(message.reactions.length).toBe(1);
    });
  });

  describe("isUserInChat", () => {
    it("should return true if user is in chat", async () => {
      const result = await ChatService.isUserInChat({
        chatId: "49794983-95cb-4ff1-b90b-8b393e86fd85",
        userId: "3daf7676-ec0f-4548-85a7-67b4382166d4",
      });

      expect(result).toBe(true);
    });

    it("should return false if user is not in chat", async () => {
      const result = await ChatService.isUserInChat({
        chatId: "49794983-95cb-4ff1-b90b-8b393e86fd85",
        userId: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
      });

      expect(result).toBe(false);
    });

    it("should return true if chat doesnt exist", async () => {
      const result = await ChatService.isUserInChat({
        chatId: "63256",
        userId: "3daf7676-ec0f-4548-85a7-67b4382166d4",
      });

      expect(result).toBe(false);
    });
  });

  describe("createMessage", () => {
    it("should create a message", async () => {
      const message = await ChatService.createMessage({
        content: "text",
        authorId: "3daf7676-ec0f-4548-85a7-67b4382166d4",
        chatId: "49794983-95cb-4ff1-b90b-8b393e86fd85",
        files: ["file1.webp"],
        responseId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
      });

      expect(isMessage(message)).toBe(true);
    });
  });

  describe("getUserChats", () => {
    it("should return user chats", async () => {
      const chats = await ChatService.getUserChats(
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );

      expect(chats.length).toBe(2);
      chats.forEach((chat) => {
        expect(isChat(chat)).toBe(true);
      });
    });
  });

  describe("getPrivateChatByUserIds", () => {
    it("should get chat if exists", async () => {
      const result = await ChatService.getPrivateChatByUserIds(
        "935719fa-05c4-42c4-9b02-2be3fefb6e61",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );

      expect(isChat(result)).toBe(true);
    });

    it("should return null if chat doesnt exist", async () => {
      const result = await ChatService.getPrivateChatByUserIds(
        "935719fa-05c4-42c4-9b02-2be3fefb6e61",
        "935719fa-05c4-42c4-9b02-2be3fefb6e61"
      );

      expect(result).toBe(null);
    });
  });

  describe("createPrivateChat", () => {
    it("should create private chat", async () => {
      const result = await ChatService.createPrivateChat(
        "935719fa-05c4-42c4-9b02-2be3fefb6e61",
        "3daf7676-ec0f-4548-85a7-67b4382166d4"
      );

      expect(isChat(result)).toBe(true);
      expect(result.type).toBe("PRIVATE");
    });
  });

  describe("createGroupChat", () => {
    it("should create group chat", async () => {
      const result = await ChatService.createGroupChat(
        ["935719fa-05c4-42c4-9b02-2be3fefb6e61"],
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

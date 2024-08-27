import { isChat } from "../../src/types/Chat";
import { isMessage } from "../../src/types/Message";
import { isReaction, Reaction } from "../../src/types/Reaction";
import { ChatService } from "../../src/services/ChatService";

describe("ChatService", () => {
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

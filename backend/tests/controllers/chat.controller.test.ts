import express from "express";
import {
  createGroupChat,
  createMessage,
  createPrivateChat,
  createReaction,
  getChatMessages,
  getUserChats,
} from "../../src/controllers/chat.controller";
import { ChatService } from "../../src/services/ChatService";
import request from "supertest";
import { upload } from "../../src/middlewares/multer";
import { processAvatar } from "../../src/utils/processAvatar";

jest.mock("../../src/services/ChatService");
jest.mock("../../src/utils/processAvatar");

describe("Chat controllers", () => {
  const app = express();
  app.use(express.json());
  app.post("/:chatId/reactions", createReaction);
  app.get("/:chatId/messages", getChatMessages);
  app.post("/:chatId/messages", upload.array("files"), createMessage);
  app.get("/chats", getUserChats);
  app.post("/chats/group", createGroupChat);
  app.post("/chats/private", createPrivateChat);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createReaction", () => {
    it("should create a reaction", async () => {
      const newReactionData = "reaction";
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.isMessageInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.createReactionToMessage as jest.Mock).mockResolvedValue(
        newReactionData
      );

      const response = await request(app)
        .post("/someId/reactions")
        .send({
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        });

      expect(response.status).toBe(201);
      expect(response.body.reaction).toEqual(newReactionData);
    });

    it("shouldn't allow if messageId is not message in chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.isMessageInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/someId/reactions")
        .send({
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("shouldn't allow if user doesn't belong to the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/someId/reactions")
        .send({
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("getChatMessages", () => {
    it("should return chat messages if the user is authorized", async () => {
      const messages = [{ id: "message1" }, { id: "message2" }];
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.getChatMessages as jest.Mock).mockResolvedValue(messages);

      const response = await request(app)
        .get("/someId/messages")
        .send({ token: { userId: "userId" } });

      expect(response.status).toBe(200);
      expect(response.body.messages).toEqual(messages);
    });

    it("shouldn't allow access if the user is not in the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .get("/someId/messages")
        .send({ token: { userId: "userId" } });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("createMessage", () => {
    it("should create a message if the user is authorized", async () => {
      const newMessage = { id: "message1", content: "Hello" };
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.createMessage as jest.Mock).mockResolvedValue(newMessage);

      const response = await request(app)
        .post("/someId/messages")
        .field("content", "Hello")
        .field("token", '{"userId": "userId"}');

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual(newMessage);
    });

    it("shouldn't allow sending a message if the user is not in the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/someId/messages")
        .field("token", '{"userId": "userId"}')
        .field("content", "Hello");

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("shouldn't allow sending a message if responseId is not in the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.isMessageInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/someId/messages")
        .field("token", '{"userId": "userId"}')
        .field("content", "Hello")
        .field("responseId", "responseId");

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("getUserChats", () => {
    it("should return user's chats", async () => {
      const chats = [{ id: "chat1" }, { id: "chat2" }];
      (ChatService.getUserChats as jest.Mock).mockResolvedValue(chats);

      const response = await request(app)
        .get("/chats")
        .send({ token: { userId: "userId" } });

      expect(response.status).toBe(200);
      expect(response.body.chats).toEqual(chats);
    });
  });

  describe("createGroupChat", () => {
    it("should create a group chat if user is in the list", async () => {
      const chat = { id: "chat1" };
      (processAvatar as jest.Mock).mockResolvedValue("file");
      (ChatService.createGroupChat as jest.Mock).mockResolvedValue(chat);

      const response = await request(app)
        .post("/chats/group")
        .send({
          token: { userId: "userId" },
          users: ["userId", "user2"],
          name: "Group Chat",
        });

      expect(response.status).toBe(201);
      expect(response.body.chat).toEqual(chat);
    });

    it("shouldn't allow if user is not in the user list", async () => {
      (processAvatar as jest.Mock).mockResolvedValue("file");

      const response = await request(app)
        .post("/chats/group")
        .send({
          token: { userId: "userId" },
          users: ["user2", "user3"],
          name: "Group Chat",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("createPrivateChat", () => {
    it("should create a private chat if user is in the list", async () => {
      const chat = { id: "chat1" };
      (ChatService.getPrivateChatByUserIds as jest.Mock).mockResolvedValue(
        null
      );
      (ChatService.createPrivateChat as jest.Mock).mockResolvedValue(chat);

      const response = await request(app)
        .post("/chats/private")
        .send({
          token: { userId: "userId" },
          users: ["userId", "user2"],
        });

      expect(response.status).toBe(201);
      expect(response.body.chat).toEqual(chat);
    });

    it("should return conflict if chat already exists", async () => {
      const existingChat = { id: "chat1" };
      (ChatService.getPrivateChatByUserIds as jest.Mock).mockResolvedValue(
        existingChat
      );

      const response = await request(app)
        .post("/chats/private")
        .send({
          token: { userId: "userId" },
          users: ["userId", "user2"],
        });

      expect(response.status).toBe(409);
      expect(response.body.chat).toEqual(existingChat);
    });

    it("shouldn't allow if user is not in the user list", async () => {
      const response = await request(app)
        .post("/chats/private")
        .send({
          token: { userId: "userId" },
          users: ["user2", "user3"],
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });
});

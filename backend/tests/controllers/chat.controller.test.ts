import express from "express";
import { ChatService } from "../../src/services/ChatService";
import request from "supertest";
import { upload } from "../../src/middlewares/multer";
import { processAvatar } from "../../src/utils/processAvatar";
import { createReactionController } from "../../src/controllers/chat/createReaction.controller";
import { getChatMessagesController } from "../../src/controllers/chat/getChatMessages.controller";
import { createMessageController } from "../../src/controllers/chat/createMessage.controller";
import { getSelfChatsController } from "../../src/controllers/chat/getSelfChats.controller";
import { createGroupChatController } from "../../src/controllers/chat/createGroupChat.controller";
import { createPrivateChatController } from "../../src/controllers/chat/createPrivateChat.controller";
import { updateAliasController } from "../../src/controllers/chat/updateUserAlias.controller";
import { addUserToGroupChatController } from "../../src/controllers/chat/addUserToGroupChat.controller";
import { deleteSelfFromGroupChatController } from "../../src/controllers/chat/deleteSelfFromGroupChat.controller";
import { updateGroupChatController } from "../../src/controllers/chat/updateGroupChat.controller";

jest.mock("../../src/services/ChatService");
jest.mock("../../src/utils/processAvatar");

describe("Chat controllers", () => {
  const app = express();
  app.use(express.json());
  app.post("/:chatId/reactions", createReactionController);
  app.get("/:chatId/messages", getChatMessagesController);
  app.post("/:chatId/messages", upload.array("files"), createMessageController);
  app.get("/chats", getSelfChatsController);
  app.post("/chats/group", createGroupChatController);
  app.post("/chats/private", createPrivateChatController);
  app.put(`/chats/:chatId/users/:userId/alias`, updateAliasController);
  app.post("/chats/:chatId/users", addUserToGroupChatController);
  app.delete("/chats/:chatId/users", deleteSelfFromGroupChatController);
  app.put("/chats/:chatId", upload.single("file"), updateGroupChatController);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateGroupChat", () => {
    it("should successfully update group chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.getChatById as jest.Mock).mockResolvedValue({
        type: "GROUP",
      });
      (processAvatar as jest.Mock).mockResolvedValue("processedAvatarPath");
      (ChatService.updateGroupChat as jest.Mock).mockResolvedValue({
        id: "123",
        name: "New Chat Name",
        avatar: "processedAvatarPath",
      });

      const response = await request(app)
        .put("/chats/123")
        .send({
          name: "New Chat Name",
          token: { userId: "789" },
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        chat: {
          id: "123",
          name: "New Chat Name",
          avatar: "processedAvatarPath",
        },
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(ChatService.getChatById).toHaveBeenCalledWith("123");
      expect(ChatService.updateGroupChat).toHaveBeenCalledWith({
        chatId: "123",
        file: "processedAvatarPath",
        name: "New Chat Name",
      });
    });

    it("should return 401 if the user is not authorized to update the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .put("/chats/123")
        .send({
          name: "New Chat Name",
          token: { userId: "789" },
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot update chat you do not belong to.",
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(ChatService.getChatType).not.toHaveBeenCalled();
      expect(processAvatar).not.toHaveBeenCalled();
      expect(ChatService.updateGroupChat).not.toHaveBeenCalled();
    });

    it("should return 400 if the chat is not of type 'GROUP'", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.getChatById as jest.Mock).mockResolvedValue({
        type: "PRIVATE",
      });

      const response = await request(app)
        .put("/chats/123")
        .send({
          name: "New Chat Name",
          token: { userId: "789" },
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "cannot update chat of this type.",
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(processAvatar).not.toHaveBeenCalled();
      expect(ChatService.updateGroupChat).not.toHaveBeenCalled();
    });
  });

  describe("deleteUserFromGroupChat", () => {
    it("should successfully delete user from group chat", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("GROUP");
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.deleteFromChat as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete("/chats/123/users")
        .send({
          token: { userId: "789" },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Successfully deleted from chat.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(ChatService.deleteFromChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
    });

    it("should return 401 if chat is not of type 'GROUP'", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("PRIVATE");

      const response = await request(app)
        .delete("/chats/123/users")
        .send({
          token: { userId: "789" },
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot remove yourself from chat of this type.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.isUserInChat).not.toHaveBeenCalled();
      expect(ChatService.deleteFromChat).not.toHaveBeenCalled();
    });

    it("should return 401 if the user is not in the chat", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("GROUP");
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .delete("/chats/123/users")
        .send({
          token: { userId: "789" },
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot remove yourself from chat which you do not belong to.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(ChatService.deleteFromChat).not.toHaveBeenCalled();
    });
  });

  describe("addUserToGroupChat", () => {
    it("should add user to group chat successfully", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("GROUP");
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(true);
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(false);
      (ChatService.addUserToChat as jest.Mock).mockResolvedValue({
        id: "newUserId",
        name: "New User",
      });

      const response = await request(app)
        .post("/chats/123/users")
        .send({
          token: { userId: "789" },
          userId: "456",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        user: { id: "newUserId", name: "New User" },
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "456",
        chatId: "123",
      });
      expect(ChatService.addUserToChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "456",
      });
    });

    it("should return 401 if chat is not of type 'GROUP'", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("PRIVATE");

      const response = await request(app)
        .post("/chats/123/users")
        .send({
          token: { userId: "789" },
          userId: "456",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot add people to chat of this type.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.addUserToChat).not.toHaveBeenCalled();
    });

    it("should return 401 if the requester is not in the chat", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("GROUP");
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(false);

      const response = await request(app)
        .post("/chats/123/users")
        .send({
          token: { userId: "789" },
          userId: "456",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot add users to chat to which you do not belong to.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.addUserToChat).not.toHaveBeenCalled();
    });

    it("should return 409 if the user is already in the chat", async () => {
      (ChatService.getChatType as jest.Mock).mockResolvedValue("GROUP");
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(true);
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .post("/chats/123/users")
        .send({
          token: { userId: "789" },
          userId: "456",
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        message: "User is already in this chat.",
      });
      expect(ChatService.getChatType).toHaveBeenCalledWith("123");
      expect(ChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(ChatService.addUserToChat).not.toHaveBeenCalled();
    });
  });

  describe("updateAlias", () => {
    it("should update alias successfully", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValue(true);
      (ChatService.updateAlias as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/chats/123/users/456/alias")
        .send({
          token: { userId: "789" },
          alias: "NewAlias",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ alias: "NewAlias" });
      expect(ChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(ChatService.updateAlias).toHaveBeenCalledWith({
        userId: "456",
        chatId: "123",
        alias: "NewAlias",
      });
    });

    it("should return 401 if the user to update is not in the chat", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(false);

      const response = await request(app)
        .put("/chats/123/users/456/alias")
        .send({
          token: { userId: "789" },
          alias: "NewAlias",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "This user doesn't belong to this chat.",
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledTimes(1);
      expect(ChatService.updateAlias).not.toHaveBeenCalled();
    });

    it("should return 401 if the requesting user is not authorized", async () => {
      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(true);

      (ChatService.isUserInChat as jest.Mock).mockResolvedValueOnce(false);

      const response = await request(app)
        .put("/chats/123/users/456/alias")
        .send({
          token: { userId: "789" },
          alias: "NewAlias",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot set aliases in chat you do not belong to.",
      });
      expect(ChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(ChatService.updateAlias).not.toHaveBeenCalled();
    });
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

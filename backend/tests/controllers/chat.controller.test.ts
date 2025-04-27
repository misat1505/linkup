import { processAvatar } from "../../src/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "../utils/mocks";
import { ChatControllers } from "../../src/controllers";

jest.mock("../../src/utils/processAvatar");

describe("Chat controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateGroupChat", () => {
    it("should successfully update group chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getChatById.mockResolvedValue({
        type: "GROUP",
      });
      (processAvatar as jest.Mock).mockResolvedValue("processedAvatarPath");
      mockChatService.updateGroupChat.mockResolvedValue({
        id: "123",
        name: "New Chat Name",
        avatar: "processedAvatarPath",
      });

      const req = mockRequest({
        body: { name: "New Chat Name", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();

      await ChatControllers.updateGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(mockChatService.getChatById).toHaveBeenCalledWith("123");
      expect(mockChatService.updateGroupChat).toHaveBeenCalledWith({
        chatId: "123",
        file: "processedAvatarPath",
        name: "New Chat Name",
      });
    });

    it("should return 401 if the user is not authorized to update the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: { name: "New Chat Name", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();

      await ChatControllers.updateGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(mockChatService.getChatType).not.toHaveBeenCalled();
      expect(processAvatar).not.toHaveBeenCalled();
      expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
    });

    it("should return 400 if the chat is not of type 'GROUP'", async () => {
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getChatById.mockResolvedValue({
        type: "PRIVATE",
      });

      const req = mockRequest({
        body: { name: "New Chat Name", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();

      await ChatControllers.updateGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
      expect(processAvatar).not.toHaveBeenCalled();
      expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
    });
  });

  describe("deleteUserFromGroupChat", () => {
    it("should successfully delete user from group chat", async () => {
      mockChatService.getChatType.mockResolvedValue("GROUP");
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.deleteFromChat.mockResolvedValue(undefined);

      const req = mockRequest({
        body: { token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(mockChatService.deleteFromChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "789",
      });
    });

    it("should return 401 if chat is not of type 'GROUP'", async () => {
      mockChatService.getChatType.mockResolvedValue("PRIVATE");

      const req = mockRequest({
        body: { token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.isUserInChat).not.toHaveBeenCalled();
      expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
    });

    it("should return 401 if the user is not in the chat", async () => {
      mockChatService.getChatType.mockResolvedValue("GROUP");
      mockChatService.isUserInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: { token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
    });
  });

  describe("addUserToGroupChat", () => {
    it("should add user to group chat successfully", async () => {
      mockChatService.getChatType.mockResolvedValue("GROUP");
      mockChatService.isUserInChat.mockResolvedValueOnce(true);
      mockChatService.isUserInChat.mockResolvedValueOnce(false);
      mockChatService.addUserToChat.mockResolvedValue({
        id: "newUserId",
        name: "New User",
      });

      const req = mockRequest({
        body: { userId: "456", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.addUserToGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "789",
        chatId: "123",
      });
      expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
        userId: "456",
        chatId: "123",
      });
      expect(mockChatService.addUserToChat).toHaveBeenCalledWith({
        chatId: "123",
        userId: "456",
      });
    });

    it("should return 401 if chat is not of type 'GROUP'", async () => {
      mockChatService.getChatType.mockResolvedValue("PRIVATE");

      const req = mockRequest({
        body: { userId: "456", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.addUserToGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
    });

    it("should return 401 if the requester is not in the chat", async () => {
      mockChatService.getChatType.mockResolvedValue("GROUP");
      mockChatService.isUserInChat.mockResolvedValueOnce(false);

      const req = mockRequest({
        body: { userId: "456", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.addUserToGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
    });

    it("should return 409 if the user is already in the chat", async () => {
      mockChatService.getChatType.mockResolvedValue("GROUP");
      mockChatService.isUserInChat.mockResolvedValueOnce(true);
      mockChatService.isUserInChat.mockResolvedValueOnce(true);

      const req = mockRequest({
        body: { userId: "456", token: { userId: "789" } },
        params: { chatId: "123" },
      });
      const res = mockResponse();
      await ChatControllers.addUserToGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
      expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
      expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
    });
  });

  describe("updateAlias", () => {
    it("should update alias successfully", async () => {
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.updateAlias.mockResolvedValue(null);

      const req = mockRequest({
        body: { token: { userId: "789" }, alias: "NewAlias" },
        params: { chatId: "123", userId: "456" },
      });
      const res = mockResponse();
      await ChatControllers.updateAlias(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(mockChatService.updateAlias).toHaveBeenCalledWith({
        userId: "456",
        chatId: "123",
        alias: "NewAlias",
      });
    });

    it("should return 401 if the user to update is not in the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValueOnce(false);

      const req = mockRequest({
        body: { token: { userId: "789" } },
        params: { chatId: "123", userId: "456" },
      });
      const res = mockResponse();
      await ChatControllers.updateAlias(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(1);
      expect(mockChatService.updateAlias).not.toHaveBeenCalled();
    });

    it("should return 401 if the requesting user is not authorized", async () => {
      mockChatService.isUserInChat.mockResolvedValueOnce(true);
      mockChatService.isUserInChat.mockResolvedValueOnce(false);

      const req = mockRequest({
        body: { token: { userId: "789" } },
        params: { chatId: "123", userId: "456" },
      });
      const res = mockResponse();
      await ChatControllers.updateAlias(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
      expect(mockChatService.updateAlias).not.toHaveBeenCalled();
    });
  });

  describe("createReaction", () => {
    it("should create a reaction", async () => {
      const newReactionData = "reaction";
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.isMessageInChat.mockResolvedValue(true);
      mockChatService.createReactionToMessage.mockResolvedValue(
        newReactionData
      );

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      });
      const res = mockResponse();
      await ChatControllers.createReaction(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("shouldn't allow if messageId is not message in chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.isMessageInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      });
      const res = mockResponse();
      await ChatControllers.createReaction(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("shouldn't allow if user doesn't belong to the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      });
      const res = mockResponse();
      await ChatControllers.createReaction(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getChatMessages", () => {
    it("should return chat messages if the user is authorized", async () => {
      const messages = [{ id: "message1" }, { id: "message2" }];
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getChatMessages.mockResolvedValue(messages);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: {},
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("shouldn't allow access if the user is not in the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: {},
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return chat messages when no responseId is provided", async () => {
      const messages = [{ id: "message1" }, { id: "message2" }];
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getChatMessages.mockResolvedValue(messages);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: { lastMessageId: "message1", limit: "5" },
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatService.getChatMessages).toHaveBeenCalledWith(
        "someId",
        "message1",
        5
      );
    });

    it("should return chat messages for a specific responseId", async () => {
      const messages = [{ id: "message1" }, { id: "message2" }];
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getPostChatMessages.mockResolvedValue(messages);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: { responseId: "response123" },
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
        "someId",
        "response123"
      );
    });

    it("should return 500 if limit is not a number", async () => {
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: { limit: "suhdusahd" },
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("should treat 'null' as a valid responseId and return null", async () => {
      const messages = [{ id: "message1" }, { id: "message2" }];
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.getPostChatMessages.mockResolvedValue(messages);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: { responseId: "null" },
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
        "someId",
        null
      );
    });

    it("should pass to error middleware if an error occurs", async () => {
      const errorMessage = "Error in processing request";
      mockChatService.isUserInChat.mockRejectedValue(new Error(errorMessage));

      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: { token: { userId: "userId" } },
        params: { chatId: "someId" },
        query: {},
      });
      const res = mockResponse();
      await ChatControllers.getChatMessages(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe("createMessage", () => {
    it("should create a message if the user is authorized", async () => {
      const newMessage = { id: "message1", content: "Hello" };
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.createMessage.mockResolvedValue(newMessage);

      const req = mockRequest({
        body: { content: "Hello", token: { userId: "userId" } },
        params: { chatId: "someId" },
        files: [],
      });
      const res = mockResponse();
      await ChatControllers.createMessage(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("shouldn't allow sending a message if the user is not in the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: { content: "Hello", token: { userId: "userId" } },
        params: { chatId: "someId" },
        files: [],
      });
      const res = mockResponse();
      await ChatControllers.createMessage(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("shouldn't allow sending a message if responseId is not in the chat", async () => {
      mockChatService.isUserInChat.mockResolvedValue(true);
      mockChatService.isMessageInChat.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          content: "Hello",
          token: { userId: "userId" },
          responseId: "responseId",
        },
        params: { chatId: "someId" },
        files: [],
      });
      const res = mockResponse();
      await ChatControllers.createMessage(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getSelfChats", () => {
    it("should return user's chats", async () => {
      const chats = [{ id: "chat1" }, { id: "chat2" }];
      mockChatService.getUserChats.mockResolvedValue(chats);

      const req = mockRequest({
        body: { token: { userId: "userId" } },
      });
      const res = mockResponse();
      await ChatControllers.getSelfChats(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("createGroupChat", () => {
    it("should create a group chat if user is in the list", async () => {
      const chat = { id: "chat1" };
      (processAvatar as jest.Mock).mockResolvedValue("file");
      mockChatService.createGroupChat.mockResolvedValue(chat);

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          users: ["userId", "user2"],
          name: "Group Chat",
        },
      });
      const res = mockResponse();
      await ChatControllers.createGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("shouldn't allow if user is not in the user list", async () => {
      (processAvatar as jest.Mock).mockResolvedValue("file");

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          users: ["user2", "user3"],
          name: "Group Chat",
        },
      });
      const res = mockResponse();
      await ChatControllers.createGroupChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("createPrivateChat", () => {
    it("should create a private chat if user is in the list", async () => {
      const chat = { id: "chat1" };
      mockChatService.getPrivateChatByUserIds.mockResolvedValue(null);
      mockChatService.createPrivateChat.mockResolvedValue(chat);

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          users: ["userId", "user2"],
        },
      });
      const res = mockResponse();
      await ChatControllers.createPrivateChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return conflict if chat already exists", async () => {
      const existingChat = { id: "chat1" };
      mockChatService.getPrivateChatByUserIds.mockResolvedValue(existingChat);

      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          users: ["userId", "user2"],
        },
      });
      const res = mockResponse();
      await ChatControllers.createPrivateChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("shouldn't allow if user is not in the user list", async () => {
      const req = mockRequest({
        body: {
          token: { userId: "userId" },
          users: ["user2", "user3"],
        },
      });
      const res = mockResponse();
      await ChatControllers.createPrivateChat(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});

import {
  createPrivateChatRules,
  createGroupChatRules,
  createMessageRules,
  createReactionRules,
  updateAliasRules,
  addUserToGroupChatRules,
  updateGroupChatRules,
} from "../../src/validators/chat.validators";
import { validate } from "../../src/middlewares/validate";
import request from "supertest";
import { mockRequest, mockResponse } from "../utils/mocks";

describe("Chat validators", () => {
  describe("Create Private Chat validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          users: [
            "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "d290f1ee-6c54-4b01-90e6-d701748f0852",
          ],
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createPrivateChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with incorrect number of users", async () => {
      const req = mockRequest({
        body: {
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createPrivateChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });

    it("fails with invalid UUID", async () => {
      const req = mockRequest({
        body: {
          users: ["invalid-uuid", "d290f1ee-6c54-4b01-90e6-d701748f0851"],
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createPrivateChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Create Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
          name: "Group Chat",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with no users", async () => {
      const req = mockRequest({
        body: {
          name: "Group Chat",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });

    it("fails with invalid name length", async () => {
      const req = mockRequest({
        body: {
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
          name: "a".repeat(101),
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Create Message validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          content: "This is a valid message",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createMessageRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with content too long", async () => {
      const req = mockRequest({
        body: {
          content: "a".repeat(5001),
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createMessageRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });

    it("fails with invalid responseId", async () => {
      const req = mockRequest({
        body: {
          content: "This is a valid message",
          responseId: "invalid-uuid",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createMessageRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Create Reaction validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          messageId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
          reactionId: "d290f1ee-6c54-4b01-90e6-d701748f0852",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createReactionRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with invalid messageId", async () => {
      const req = mockRequest({
        body: {
          messageId: "invalid-uuid",
          reactionId: "d290f1ee-6c54-4b01-90e6-d701748f0852",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createReactionRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });

    it("fails with invalid reactionId", async () => {
      const req = mockRequest({
        body: {
          messageId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
          reactionId: "invalid-uuid",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(createReactionRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Update Alias validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          alias: "New Alias",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateAliasRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("passes with null alias", async () => {
      const req = mockRequest({
        body: {
          alias: null,
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateAliasRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with alias too long", async () => {
      const req = mockRequest({
        body: {
          alias: "a".repeat(101),
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateAliasRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Add User to Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(addUserToGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with invalid userId", async () => {
      const req = mockRequest({
        body: {
          userId: "invalid-uuid",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(addUserToGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });

  describe("Update Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const req = mockRequest({
        body: {
          name: "Updated Group Chat Name",
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("passes with null name", async () => {
      const req = mockRequest({
        body: { name: null },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("fails with name too long", async () => {
      const req = mockRequest({
        body: {
          name: "a".repeat(101),
        },
      });
      const res = mockResponse();
      const mockNextFunction = jest.fn();

      const middleware = validate(updateGroupChatRules);
      await middleware(req, res, mockNextFunction);

      expect(mockNextFunction).not.toHaveBeenCalled();

      const jsonCallArgs = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCallArgs.errors).toHaveLength(1);
    });
  });
});

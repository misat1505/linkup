import express from "express";
import {
  createPrivateChatRules,
  createGroupChatRules,
  createMessageRules,
  createReactionRules,
  updateAliasRules,
  addUserToGroupChatRules,
  updateGroupChatRules,
} from "../../src/validators/chat.validators";
import { ValidationChain } from "express-validator";
import { validate } from "../../src/middlewares/validate";
import request from "supertest";
import i18next from "../../src/i18n";
import middleware from "i18next-http-middleware";

const createTestServer = (validations: ValidationChain[]) => {
  const app = express();
  app.use(express.json());
  app.use(middleware.handle(i18next));
  app.post("/test", validate(validations), (req, res) => {
    res.status(200).send("Validation passed");
  });
  return app;
};

describe("Chat validators", () => {
  describe("Create Private Chat validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(createPrivateChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          users: [
            "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "d290f1ee-6c54-4b01-90e6-d701748f0852",
          ],
        });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with incorrect number of users", async () => {
      const app = createTestServer(createPrivateChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Users should be an array with exactly 2 UUIDs",
          }),
        ])
      );
    });

    it("fails with invalid UUID", async () => {
      const app = createTestServer(createPrivateChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          users: ["invalid-uuid", "d290f1ee-6c54-4b01-90e6-d701748f0852"],
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Each user should be a valid UUID",
          }),
        ])
      );
    });
  });

  describe("Create Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(createGroupChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
          name: "Group Chat",
        });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with no users", async () => {
      const app = createTestServer(createGroupChatRules);
      const res = await request(app).post("/test").send({
        name: "Group Chat",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Users should be an array with at least 1 UUID",
          }),
        ])
      );
    });

    it("fails with invalid name length", async () => {
      const app = createTestServer(createGroupChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          users: ["d290f1ee-6c54-4b01-90e6-d701748f0851"],
          name: "a".repeat(101),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Name should be a string with a maximum length of 100 characters",
          }),
        ])
      );
    });
  });

  describe("Create Message validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(createMessageRules);
      const res = await request(app).post("/test").send({
        content: "This is a valid message",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with content too long", async () => {
      const app = createTestServer(createMessageRules);
      const res = await request(app)
        .post("/test")
        .send({
          content: "a".repeat(5001),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Content should be a string with a maximum length of 5000 characters",
          }),
        ])
      );
    });

    it("fails with invalid responseId", async () => {
      const app = createTestServer(createMessageRules);
      const res = await request(app).post("/test").send({
        content: "This is a valid message",
        responseId: "invalid-uuid",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Response ID should be a valid UUID",
          }),
        ])
      );
    });
  });

  describe("Create Reaction validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(createReactionRules);
      const res = await request(app).post("/test").send({
        messageId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        reactionId: "d290f1ee-6c54-4b01-90e6-d701748f0852",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with invalid messageId", async () => {
      const app = createTestServer(createReactionRules);
      const res = await request(app).post("/test").send({
        messageId: "invalid-uuid",
        reactionId: "d290f1ee-6c54-4b01-90e6-d701748f0852",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "messageId should be a valid UUID",
          }),
        ])
      );
    });

    it("fails with invalid reactionId", async () => {
      const app = createTestServer(createReactionRules);
      const res = await request(app).post("/test").send({
        messageId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        reactionId: "invalid-uuid",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "reactionId should be a valid UUID",
          }),
        ])
      );
    });
  });

  describe("Update Alias validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(updateAliasRules);
      const res = await request(app).post("/test").send({
        alias: "New Alias",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("passes with null alias", async () => {
      const app = createTestServer(updateAliasRules);
      const res = await request(app).post("/test").send({
        alias: null,
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with alias too long", async () => {
      const app = createTestServer(updateAliasRules);
      const res = await request(app)
        .post("/test")
        .send({
          alias: "a".repeat(101),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "alias should be null or a string of maximum length of 100 characters",
          }),
        ])
      );
    });
  });

  describe("Add User to Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(addUserToGroupChatRules);
      const res = await request(app).post("/test").send({
        userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with invalid userId", async () => {
      const app = createTestServer(addUserToGroupChatRules);
      const res = await request(app).post("/test").send({
        userId: "invalid-uuid",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "userId should be a valid UUID",
          }),
        ])
      );
    });
  });

  describe("Update Group Chat validation rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(updateGroupChatRules);
      const res = await request(app).post("/test").send({
        name: "Updated Group Chat Name",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("passes with null name", async () => {
      const app = createTestServer(updateGroupChatRules);
      const res = await request(app).post("/test").send({
        name: null,
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with name too long", async () => {
      const app = createTestServer(updateGroupChatRules);
      const res = await request(app)
        .post("/test")
        .send({
          name: "a".repeat(101),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Name should be a string with a maximum length of 100 characters",
          }),
        ])
      );
    });
  });
});

import express from "express";
import {
  createPrivateChatRules,
  createGroupChatRules,
  createMessageRules,
} from "../../src/validators/chat.validators";
import { ValidationChain } from "express-validator";
import { validate } from "../../src/middlewares/validate";
import request from "supertest";

const createTestServer = (validations: ValidationChain[]) => {
  const app = express();
  app.use(express.json());
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
});

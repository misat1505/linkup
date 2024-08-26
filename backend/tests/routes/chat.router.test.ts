import app from "../../src/app";
import { JwtHandler } from "../../src/lib/JwtHandler";
import { VALID_USER_ID } from "../utils/constants";
import request from "supertest";
import fs from "fs";
import path from "path";
import { Message } from "../../src/models/Message";

const token = JwtHandler.encode({ userId: VALID_USER_ID });

describe("chat router", () => {
  describe("/chats", () => {
    it("should get user chats", async () => {
      const res = await request(app)
        .get("/chats")
        .set("Cookie", `token=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.chats.length).toBe(2);
    });
  });

  describe("/chats/private", () => {
    it("should get user chats", async () => {
      const res = await request(app)
        .post("/chats/private")
        .set("Cookie", `token=${token}`)
        .send({
          users: [VALID_USER_ID, VALID_USER_ID],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.chat).toBeInstanceOf(Object);

      const res2 = await request(app)
        .get("/chats")
        .set("Cookie", `token=${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.chats.length).toBe(3);
    });
  });

  describe("/chats/group", () => {
    it("should create group chat", async () => {
      const res = await request(app)
        .post("/chats/group")
        .set("Cookie", `token=${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("users[1]", VALID_USER_ID)
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      expect(res.statusCode).toBe(201);
      expect(res.body.chat).toBeInstanceOf(Object);

      const file = res.body.chat.photoURL;
      const filepath = path.join(__dirname, "..", "..", "static", file);
      expect(fs.existsSync(filepath)).toBe(true);

      const res2 = await request(app)
        .get("/chats")
        .set("Cookie", `token=${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.chats.length).toBe(3);

      fs.unlinkSync(filepath);
    });
  });

  describe("[GET] chats/:chatId/messages", () => {
    it("should get chat messages", async () => {
      const res = await request(app)
        .get(`/chats/74c78678-40b2-44cf-8436-fdc762480e92/messages`)
        .set("Cookie", `token=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.messages).toBeInstanceOf(Array);
      expect(res.body.messages.length).toBe(1);
    });
  });

  describe("[POST] chats/:chatId/messages", () => {
    it("should create new message", async () => {
      const res = await request(app)
        .post(`/chats/74c78678-40b2-44cf-8436-fdc762480e92/messages`)
        .field("content", "message")
        .field("responseId", "01918dfb-ddd4-7e01-84df-1c8321cc9852")
        .attach("files", Buffer.from("message file"), "file1.txt")
        .attach("files", Buffer.from("message file2"), "file2.txt")
        .set("Cookie", `token=${token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBeInstanceOf(Object);

      const paths = (res.body.message as Message).files.map((file) => file.url);
      const filepaths = paths.map((p) =>
        path.join(__dirname, "..", "..", "static", p)
      );
      filepaths.forEach((filepath) => {
        expect(fs.existsSync(filepath)).toBe(true);
      });

      const res2 = await request(app)
        .get(`/chats/74c78678-40b2-44cf-8436-fdc762480e92/messages`)
        .set("Cookie", `token=${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.messages.length).toBe(2);

      filepaths.forEach((filepath) => {
        fs.unlinkSync(filepath);
      });
    });
  });

  describe("[POST] /chats/:chatId/reactions", () => {
    it("should create a reaction", async () => {
      const res = await request(app)
        .get(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/messages`)
        .set("Cookie", `token=${token}`);
      const initialReactions = (res.body.messages[0] as Message).reactions
        .length;

      const res2 = await request(app)
        .post(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/reactions`)
        .set("Cookie", `token=${token}`)
        .send({
          reactionId: "9aed7a49-238d-4c29-b5b9-368bb0253e8b",
          messageId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
        });
      expect(res2.statusCode).toBe(201);
      expect(res2.body.reaction).toBeInstanceOf(Object);

      const res3 = await request(app)
        .get(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/messages`)
        .set("Cookie", `token=${token}`);
      expect((res3.body.messages[0] as Message).reactions.length).toBe(
        initialReactions + 1
      );
    });
  });
});

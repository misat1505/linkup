import app from "../../src/app";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { USER, VALID_USER_ID } from "../utils/constants";
import request from "supertest";
import fs from "fs";
import path from "path";
import { Message } from "../../src/types/Message";
import { isChat } from "../../src/types/guards/chat.guard";
import { isMessage } from "../../src/types/guards/message.guard";
import { isReaction } from "../../src/types/guards/reaction.guard";
import { Chat } from "../../src/types/Chat";
import { isUserInChat } from "../../src/types/guards/user.guard";
import { env } from "../../src/config/env";

const token = TokenProcessor.encode(
  { userId: VALID_USER_ID },
  env.ACCESS_TOKEN_SECRET
);

describe("chat router", () => {
  describe("[GET] /chats", () => {
    it("should get user chats", async () => {
      const res = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.chats.length).toBe(2);
      res.body.chats.forEach((chat: unknown) => {
        expect(isChat(chat, { allowStringifiedDates: true })).toBe(true);
      });
    });
  });

  describe("[POST] /chats/private", () => {
    it("should create user chats", async () => {
      const res = await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [VALID_USER_ID, VALID_USER_ID],
        });

      expect(res.statusCode).toBe(201);
      expect(isChat(res.body.chat, { allowStringifiedDates: true })).toBe(true);

      const res2 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.chats.length).toBe(3);
      res2.body.chats.forEach((chat: unknown) => {
        expect(isChat(chat, { allowStringifiedDates: true })).toBe(true);
      });
    });
  });

  describe("[POST] /chats/group", () => {
    it("should create group chat", async () => {
      const res = await request(app)
        .post("/chats/group")
        .set("Authorization", `Bearer ${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("users[1]", VALID_USER_ID)
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      expect(res.statusCode).toBe(201);
      expect(isChat(res.body.chat, { allowStringifiedDates: true })).toBe(true);

      const { photoURL: file, id } = res.body.chat;
      const filepath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "chats",
        id,
        file
      );
      expect(fs.existsSync(filepath)).toBe(true);

      const res2 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.chats.length).toBe(3);
      res2.body.chats.forEach((chat: unknown) => {
        expect(isChat(chat, { allowStringifiedDates: true })).toBe(true);
      });

      fs.rmdirSync(path.dirname(filepath), { recursive: true });
    });
  });

  describe("[GET] chats/:chatId/messages", () => {
    it("should get chat messages", async () => {
      const res = await request(app)
        .get(`/chats/74c78678-40b2-44cf-8436-fdc762480e92/messages`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.messages.length).toBe(1);
      res.body.messages.forEach((message: unknown) => {
        expect(isMessage(message, { allowStringifiedDates: true })).toBe(true);
      });
    });
  });

  describe("[POST] chats/:chatId/messages", () => {
    it("should create new message", async () => {
      const chatId = "74c78678-40b2-44cf-8436-fdc762480e92";
      const res = await request(app)
        .post(`/chats/${chatId}/messages`)
        .field("content", "message")
        .field("responseId", "01918dfb-ddd4-7e01-84df-1c8321cc9852")
        .attach("files", Buffer.from("message file"), "file1.txt")
        .attach("files", Buffer.from("message file2"), "file2.txt")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(201);
      expect(isMessage(res.body.message, { allowStringifiedDates: true })).toBe(
        true
      );

      const paths = (res.body.message as Message).files.map((file) => file.url);
      const filepaths = paths.map((p) =>
        path.join(__dirname, "..", "..", "files", "chats", chatId, p)
      );
      filepaths.forEach((filepath) => {
        expect(fs.existsSync(filepath)).toBe(true);
      });

      const res2 = await request(app)
        .get(`/chats/${chatId}/messages`)
        .set("Authorization", `Bearer ${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.messages.length).toBe(2);
      res2.body.messages.forEach((message: unknown) => {
        expect(isMessage(message, { allowStringifiedDates: true })).toBe(true);
      });

      fs.rmdirSync(path.dirname(filepaths[0]), { recursive: true });
    });
  });

  describe("[POST] /chats/:chatId/reactions", () => {
    it("should create a reaction", async () => {
      const res = await request(app)
        .get(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/messages`)
        .set("Authorization", `Bearer ${token}`);
      const initialReactions = (res.body.messages[0] as Message).reactions
        .length;

      const res2 = await request(app)
        .post(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/reactions`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          reactionId: "9aed7a49-238d-4c29-b5b9-368bb0253e8b",
          messageId: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
        });
      expect(res2.statusCode).toBe(201);
      expect(
        isReaction(res2.body.reaction, { allowStringifiedDates: true })
      ).toBe(true);

      const res3 = await request(app)
        .get(`/chats/49794983-95cb-4ff1-b90b-8b393e86fd85/messages`)
        .set("Authorization", `Bearer ${token}`);
      expect((res3.body.messages[0] as Message).reactions.length).toBe(
        initialReactions + 1
      );
    });
  });

  describe("[PUT] /chats/:chatId/users/:userId/alias", () => {
    it("should update alias in chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const userId = USER.id;
      const alias = "new alias";

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      const user1 = chat1.users?.find((u) => u.id === userId);
      expect(user1?.alias).toBeNull();

      const res2 = await request(app)
        .put(`/chats/${chatId}/users/${userId}/alias`)
        .set("Authorization", `Bearer ${token}`)
        .send({ alias });
      expect(res2.body.alias).toBe(alias);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      const user3 = chat3.users?.find((u) => u.id === userId);
      expect(user3?.alias).toBe(alias);
    });
  });

  describe("[POST] /chats/:chatId/users", () => {
    it("should add user to group chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";
      const userId = "935719fa-05c4-42c4-9b02-2be3fefb6e61";

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      const user1 = chat1.users?.find((u) => u.id === userId);
      expect(user1).toBeUndefined();

      const res2 = await request(app)
        .post(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(
        isUserInChat(res2.body.user, { allowStringifiedDates: true })
      ).toBe(true);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      const user3 = chat3.users?.find((u) => u.id === userId);
      expect(isUserInChat(user3, { allowStringifiedDates: true })).toBe(true);
    });
  });

  describe("[DELETE] /chats/:chatId/users", () => {
    it("should delete self from group chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(isChat(chat1, { allowStringifiedDates: true })).toBe(true);

      await request(app)
        .delete(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(chat3).toBeUndefined();
    });
  });

  describe("[PUT] /chats/:chatId", () => {
    it("should update group chat", async () => {
      const chatId = "49794983-95cb-4ff1-b90b-8b393e86fd85";

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(isChat(chat1, { allowStringifiedDates: true })).toBe(true);
      expect(chat1.name).toBe("Group Chat");
      expect(chat1.photoURL).toBe("chat-photo.webp");

      const res2 = await request(app)
        .put(`/chats/${chatId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      expect(res2.statusCode).toBe(201);
      expect(isChat(res2.body.chat, { allowStringifiedDates: true })).toBe(
        true
      );

      const { photoURL: file, id } = res2.body.chat;
      const filepath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "chats",
        id,
        file
      );
      expect(fs.existsSync(filepath)).toBe(true);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);

      expect(res3.statusCode).toBe(200);
      res3.body.chats.forEach((chat: unknown) => {
        expect(isChat(chat, { allowStringifiedDates: true })).toBe(true);
      });
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(chat3.name).toBe("chat name");
      expect(chat3.photoURL).not.toBe("chat-photo.webp");

      fs.rmdirSync(path.dirname(filepath), { recursive: true });
    });
  });
});

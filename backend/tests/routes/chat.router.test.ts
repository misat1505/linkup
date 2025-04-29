import request from "supertest";
import path from "path";
import { Message } from "../../src/types/Message";
import { Chat, UserInChat } from "../../src/types/Chat";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFileStorage } from "../utils/mocks";
import { TestHelpers } from "../utils/helpers";
import { Reaction } from "../../src/types/Reaction";

jest.mock("../../src/lib/FileStorage");

describe("chat router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("[GET] /chats", () => {
    it("should get user chats", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.chats.length).toBe(seed.chats.length);
        res.body.chats.forEach((chat: unknown) => {
          Chat.strict().parse(chat);
        });
      });
    });
  });

  describe("[POST] /chats/private", () => {
    it("should create user chats", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const userId = seed.users[0].id;
        const token = TestHelpers.createToken(userId);
        const initialChatsCount = seed.chats.length;

        const res = await request(app)
          .post("/chats/private")
          .set("Authorization", `Bearer ${token}`)
          .send({
            users: [userId, userId],
          });

        expect(res.statusCode).toBe(201);
        Chat.strict().parse(res.body.chat);

        const res2 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.chats.length).toBe(initialChatsCount + 1);
        res2.body.chats.forEach((chat: unknown) => {
          Chat.strict().parse(chat);
        });
      });
    });
  });

  describe("[POST] /chats/group", () => {
    it("should create group chat", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const initialChatsCount = seed.chats.length;
        const userId = seed.users[0].id;
        const token = TestHelpers.createToken(userId);

        const res = await request(app)
          .post("/chats/group")
          .set("Authorization", `Bearer ${token}`)
          .field("users[0]", userId)
          .field("users[1]", userId)
          .field("name", "chat name")
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        expect(res.statusCode).toBe(201);
        Chat.strict().parse(res.body.chat);

        const res2 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.chats.length).toBe(initialChatsCount + 1);
        res2.body.chats.forEach((chat: unknown) => {
          Chat.strict().parse(chat);
        });
      });
    });
  });

  describe("[GET] chats/:chatId/messages", () => {
    it("should get chat messages", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);
        const chatId = seed.chats[0].id;
        const messages = seed.messages.filter((m) => m.chatId === chatId);

        const res = await request(app)
          .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.messages.length).toBe(messages.length);
        res.body.messages.forEach((message: unknown) => {
          Message.strict().parse(message);
        });
      });
    });
  });

  describe("[POST] chats/:chatId/messages", () => {
    it("should create new message", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        app.services.fileStorage = mockFileStorage as any;
        const chatId = seed.chats[0].id;
        const messages = seed.messages.filter((m) => m.chatId === chatId);
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .post(`/chats/${chatId}/messages`)
          .field("content", "message")
          .field("responseId", messages[0].id)
          .attach("files", Buffer.from("message file"), "file1.txt")
          .attach("files", Buffer.from("message file2"), "file2.txt")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(201);
        Message.strict().parse(res.body.message);

        const res2 = await request(app)
          .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
          .set("Authorization", `Bearer ${token}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.messages.length).toBe(messages.length + 1);
        res2.body.messages.forEach((message: unknown) => {
          Message.strict().parse(message);
        });
      });
    });
  });

  describe("[POST] /chats/:chatId/reactions", () => {
    it("should create a reaction", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const chatId = seed.chats[1].id;
        const messages = seed.messages.filter((m) => m.chatId === chatId);
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
          .set("Authorization", `Bearer ${token}`);
        const initialReactions = (res.body.messages[0] as Message).reactions
          .length;

        const res2 = await request(app)
          .post(`/chats/${chatId}/reactions`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            reactionId: seed.reactions[1].id,
            messageId: messages[0].id,
          });
        expect(res2.statusCode).toBe(201);
        Reaction.strict().parse(res2.body.reaction);

        const res3 = await request(app)
          .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
          .set("Authorization", `Bearer ${token}`);
        expect((res3.body.messages[0] as Message).reactions.length).toBe(
          initialReactions + 1
        );
      });
    });
  });

  describe("[PUT] /chats/:chatId/users/:userId/alias", () => {
    it("should update alias in chat", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const chatId = seed.chats[1].id;
        const userId = seed.users[0].id;
        const alias = "new alias";
        const token = TestHelpers.createToken(userId);

        const res1 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);

        const chat1 = res1.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;

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

        const chat3 = res3.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        const user3 = chat3.users?.find((u) => u.id === userId);
        expect(user3?.alias).toBe(alias);
      });
    });
  });

  describe("[POST] /chats/:chatId/users", () => {
    it("should add user to group chat", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const chatId = seed.chats[1].id;
        const userId = seed.users[1].id;
        const token = TestHelpers.createToken(seed.users[0].id);

        const res1 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);
        const chat1 = res1.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        const user1 = chat1.users?.find((u) => u.id === userId);
        expect(user1).toBeUndefined();

        const res2 = await request(app)
          .post(`/chats/${chatId}/users`)
          .set("Authorization", `Bearer ${token}`)
          .send({ userId });
        UserInChat.strict().parse(res2.body.user);

        const res3 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);
        const chat3 = res3.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        const user3 = chat3.users?.find((u) => u.id === userId);
        UserInChat.strict().parse(user3);
      });
    });
  });

  describe("[DELETE] /chats/:chatId/users", () => {
    it("should delete self from group chat", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const chatId = seed.chats[1].id;
        const token = TestHelpers.createToken(seed.users[0].id);

        const res1 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);
        const chat1 = res1.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;

        Chat.strict().parse(chat1);

        await request(app)
          .delete(`/chats/${chatId}/users`)
          .set("Authorization", `Bearer ${token}`);

        const res3 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);
        const chat3 = res3.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        expect(chat3).toBeUndefined();
      });
    });
  });

  describe("[PUT] /chats/:chatId", () => {
    it("should update group chat", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        app.services.fileStorage = mockFileStorage as any;
        const chatId = seed.chats[1].id;
        const token = TestHelpers.createToken(seed.users[0].id);

        const res1 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);
        const chat1 = res1.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        Chat.strict().parse(chat1);
        expect(chat1.name).toBe("Group Chat");
        expect(chat1.photoURL).toBe("chat-photo.webp");

        const res2 = await request(app)
          .put(`/chats/${chatId}`)
          .set("Authorization", `Bearer ${token}`)
          .field("name", "chat name")
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        expect(res2.statusCode).toBe(201);
        Chat.strict().parse(res2.body.chat);

        const res3 = await request(app)
          .get("/chats")
          .set("Authorization", `Bearer ${token}`);

        expect(res3.statusCode).toBe(200);
        res3.body.chats.forEach((chat: unknown) => {
          Chat.strict().parse(chat);
        });
        const chat3 = res3.body.chats.find(
          (c: Chat) => c.id === chatId
        )! as Chat;
        expect(chat3.name).toBe("chat name");
        expect(chat3.photoURL).not.toBe("chat-photo.webp");
      });
    });
  });

  describe("[GET] /chats/reactions", () => {
    it("should get available reactions", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const res = await request(app).get("/chats/reactions");

        expect(res.statusCode).toBe(200);
        expect(res.body.reactions).toEqual(seed.reactions);
      });
    });
  });
});

import { Message } from "../../../src/types/Message";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] chats/:chatId/messages", () => {
  it("should get chat messages", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const chatId = seed.chats[0].id;
      const messages = seed.messages.filter((m) => m.chatId === chatId);

      const res = await request(app)
        .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.messages.length).toBe(messages.length);
      res.body.messages.forEach((message: unknown) => {
        Message.strict().parse(message);
      });
    });
  });

  it("shouldn't allow no query params", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const chatId = seed.chats[0].id;

      await request(app)
        .get(`/chats/${chatId}/messages`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  it("shouldn't require limit if lastMessageId provided", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const chatId = seed.chats[0].id;

      await request(app)
        .get(`/chats/${chatId}/messages?lastMessageId=null`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  it("shouldn't allow to get messages from chat in which user is not part of", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[1].id);
      const chatId = seed.chats[1].id;

      await request(app)
        .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });

  it("should allow responseId", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const chatId = seed.chats[0].id;

      await request(app)
        .get(`/chats/${chatId}/messages?responseId=null`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

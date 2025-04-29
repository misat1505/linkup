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
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.messages.length).toBe(messages.length);
      res.body.messages.forEach((message: unknown) => {
        Message.strict().parse(message);
      });
    });
  });
});

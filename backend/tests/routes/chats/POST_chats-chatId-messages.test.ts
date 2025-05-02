import { Message } from "../../../src/types/Message";
import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

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
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      Message.strict().parse(res.body.message);

      const res2 = await request(app)
        .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res2.body.messages.length).toBe(messages.length + 1);
      res2.body.messages.forEach((message: unknown) => {
        Message.strict().parse(message);
      });
    });
  });

  it("shouldn't allow to send a message for a user that doesn't belong to the chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[1].id);

      await request(app)
        .post(`/chats/${chatId}/messages`)
        .send({ content: "message" })
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });

  it("shouldn't allow to respond to the message not belonging to the chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const message = seed.messages[0];
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .post(`/chats/${chatId}/messages`)
        .send({ content: "message", responseId: message.id })
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });
});

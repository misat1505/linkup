import { Message } from "../../../src/types/Message";
import { Reaction } from "../../../src/types/Reaction";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /chats/:chatId/reactions", () => {
  it("creates message reaction", async () => {
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
        })
        .expect(201);
      Reaction.strict().parse(res2.body.reaction);

      const res3 = await request(app)
        .get(`/chats/${chatId}/messages?lastMessageId=null&limit=20`)
        .set("Authorization", `Bearer ${token}`);
      expect((res3.body.messages[0] as Message).reactions.length).toBe(
        initialReactions + 1
      );
    });
  });

  it("blocks reaction creation by non-chat member", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const message = seed.messages.find((m) => m.chatId === chatId)!;
      const token = TestHelpers.createToken(seed.users[1].id);

      await request(app)
        .post(`/chats/${chatId}/reactions`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          reactionId: seed.reactions[1].id,
          messageId: message.id,
        })
        .expect(401);
    });
  });

  it("blocks reaction to message outside chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const message = seed.messages.find((m) => m.chatId !== chatId)!;
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .post(`/chats/${chatId}/reactions`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          reactionId: seed.reactions[1].id,
          messageId: message.id,
        })
        .expect(401);
    });
  });
});

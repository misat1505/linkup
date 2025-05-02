import { Chat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[DELETE] /chats/:chatId/users", () => {
  it("should delete self from group chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[0].id);

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;

      Chat.strict().parse(chat1);

      await request(app)
        .delete(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(chat3).toBeUndefined();
    });
  });

  it("shouldn't be able to leave chat which user is not part of", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[1].id);

      await request(app)
        .delete(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });

  it("shouldn't be able to leave private chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[0].id;
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .delete(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });
});

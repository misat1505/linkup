import { StatusCodes } from "http-status-codes";
import { Chat } from "@/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[PUT] /chats/:chatId/users/:userId/alias", () => {
  it("updates user alias in chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const userId = seed.users[0].id;
      const alias = "new alias";
      const token = TestHelpers.createToken(userId);

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

  it("blocks alias update by non-chat member", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const userId = seed.users[1].id;
      const alias = "new alias";
      const token = TestHelpers.createToken(userId);

      await request(app)
        .put(`/chats/${chatId}/users/${seed.users[0].id}/alias`)
        .set("Authorization", `Bearer ${token}`)
        .send({ alias })
        .expect(StatusCodes.FORBIDDEN);
    });
  });
});

import { Chat, UserInChat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /chats/:chatId/users", () => {
  it("should add user to group chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const userId = seed.users[1].id;
      const token = TestHelpers.createToken(seed.users[0].id);

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
      UserInChat.strict().parse(res2.body.user);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      const user3 = chat3.users?.find((u) => u.id === userId);
      UserInChat.strict().parse(user3);
    });
  });
});

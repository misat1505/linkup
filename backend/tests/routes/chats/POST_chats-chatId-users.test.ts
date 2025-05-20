import { StatusCodes } from "http-status-codes";
import { Chat, UserInChat } from "@/types/Chat";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";

describe("[POST] /chats/:chatId/users", () => {
  it("adds user to group chat", async () => {
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

  it("blocks adding user to private chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(seed.users[0].id);

      const response = await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [userId, userId],
        })
        .expect(StatusCodes.CREATED);

      const chatId = response.body.chat.id;

      await request(app)
        .post(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: seed.users[1].id })
        .expect(StatusCodes.BAD_REQUEST);
    });
  });

  it("blocks adding user by non-chat member", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[1].id);

      await request(app)
        .post(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: uuidv4() })
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  it("blocks adding self to chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const userId = seed.users[1].id;
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(userId);

      await request(app)
        .post(`/chats/${chatId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId })
        .expect(StatusCodes.FORBIDDEN);
    });
  });
});

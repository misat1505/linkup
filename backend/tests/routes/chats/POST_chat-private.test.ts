import { Chat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

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

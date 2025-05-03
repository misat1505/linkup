import { Chat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /chats", () => {
  it("retrieves user chats", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.chats.length).toBe(seed.chats.length);
      res.body.chats.forEach((chat: unknown) => {
        Chat.strict().parse(chat);
      });
    });
  });
});

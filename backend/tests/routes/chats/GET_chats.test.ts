import { StatusCodes } from "http-status-codes";
import { Chat } from "@/types/Chat";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[GET] /chats", () => {
  it("retrieves user chats", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body.chats.length).toBe(seed.chats.length);
      res.body.chats.forEach((chat: unknown) => {
        Chat.strict().parse(chat);
      });
    });
  });
});

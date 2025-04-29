import { Chat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import path from "path";
import request from "supertest";

describe("[POST] /chats/group", () => {
  it("should create group chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const initialChatsCount = seed.chats.length;
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(userId);

      const res = await request(app)
        .post("/chats/group")
        .set("Authorization", `Bearer ${token}`)
        .field("users[0]", userId)
        .field("users[1]", userId)
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "..", "utils", "image.jpg"));

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

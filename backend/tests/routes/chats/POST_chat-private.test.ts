import { StatusCodes } from "http-status-codes";
import { Chat } from "@/types/Chat";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";

describe("[POST] /chats/private", () => {
  it("creates new private chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(userId);
      const initialChatsCount = seed.chats.length;

      const res = await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [userId, userId],
        })
        .expect(StatusCodes.CREATED);

      Chat.strict().parse(res.body.chat);

      const res2 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res2.body.chats.length).toBe(initialChatsCount + 1);
      res2.body.chats.forEach((chat: unknown) => {
        Chat.strict().parse(chat);
      });
    });
  });

  it("blocks private chat creation if already exists", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(userId);

      await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [userId, seed.users[1].id],
        })
        .expect(StatusCodes.CONFLICT);

      await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [seed.users[1].id, userId],
        })
        .expect(StatusCodes.CONFLICT);
    });
  });

  it("blocks private chat creation by non-member", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const mockUserId = uuidv4();
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(userId);

      await request(app)
        .post("/chats/private")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: [mockUserId, seed.users[1].id],
        })
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

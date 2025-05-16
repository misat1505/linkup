import { StatusCodes } from "http-status-codes";
import { Chat } from "@/types/Chat";
import { TEST_FILENAME_PATH } from "../../utils/constants";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /chats/group", () => {
  it("creates new group chat", async () => {
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
        .attach("file", TEST_FILENAME_PATH)
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

  it("blocks group chat creation without creator", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const userId = seed.users[0].id;
      const token = TestHelpers.createToken(userId);

      await request(app)
        .post("/chats/group")
        .set("Authorization", `Bearer ${token}`)
        .field("users[0]", seed.users[1].id)
        .field("name", "chat name")
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

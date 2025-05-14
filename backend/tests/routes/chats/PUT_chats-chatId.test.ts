import { StatusCodes } from "http-status-codes";
import { Chat } from "../../../src/types/Chat";
import { TEST_FILENAME_PATH } from "../../utils/constants";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import path from "path";
import request from "supertest";

describe("[PUT] /chats/:chatId", () => {
  it("updates group chat details", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const token = TestHelpers.createToken(seed.users[0].id);

      const res1 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);
      const chat1 = res1.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      Chat.strict().parse(chat1);
      expect(chat1.name).toBe("Group Chat");
      expect(chat1.photoURL).toBe("chat-photo.webp");

      const res2 = await request(app)
        .put(`/chats/${chatId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("name", "chat name")
        .attach("file", TEST_FILENAME_PATH)
        .expect(StatusCodes.OK);

      Chat.strict().parse(res2.body.chat);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      res3.body.chats.forEach((chat: unknown) => {
        Chat.strict().parse(chat);
      });
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(chat3.name).toBe("chat name");
      expect(chat3.photoURL).not.toBe("chat-photo.webp");
    });
  });

  it("blocks chat update by non-member", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const chatId = seed.chats[1].id;
      const userId = seed.users[1].id;
      const token = TestHelpers.createToken(userId);

      await request(app)
        .put(`/chats/${chatId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "chat name" })
        .expect(StatusCodes.FORBIDDEN);
    });
  });
});

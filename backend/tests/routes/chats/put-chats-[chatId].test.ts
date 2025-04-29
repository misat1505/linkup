import { Chat } from "../../../src/types/Chat";
import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import path from "path";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

describe("[PUT] /chats/:chatId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update group chat", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
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
        .attach("file", path.join(__dirname, "..", "..", "utils", "image.jpg"));

      expect(res2.statusCode).toBe(201);
      Chat.strict().parse(res2.body.chat);

      const res3 = await request(app)
        .get("/chats")
        .set("Authorization", `Bearer ${token}`);

      expect(res3.statusCode).toBe(200);
      res3.body.chats.forEach((chat: unknown) => {
        Chat.strict().parse(chat);
      });
      const chat3 = res3.body.chats.find((c: Chat) => c.id === chatId)! as Chat;
      expect(chat3.name).toBe("chat name");
      expect(chat3.photoURL).not.toBe("chat-photo.webp");
    });
  });
});

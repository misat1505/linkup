import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /chats/reactions", () => {
  it("should get available reactions", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const res = await request(app).get("/chats/reactions").expect(200);

      expect(res.body.reactions).toEqual(seed.reactions);
    });
  });
});

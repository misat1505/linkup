import { StatusCodes } from "http-status-codes";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[GET] /chats/reactions", () => {
  it("retrieves available chat reactions", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const res = await request(app)
        .get("/chats/reactions")
        .expect(StatusCodes.OK);

      expect(res.body.reactions).toEqual(seed.reactions);
    });
  });
});

import { testWithTransaction } from "@tests/utils/testWithTransaction";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it } from "vitest";

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

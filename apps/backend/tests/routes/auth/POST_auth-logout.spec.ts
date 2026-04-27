import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("[POST] /auth/logout", () => {
  it("logs out user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});

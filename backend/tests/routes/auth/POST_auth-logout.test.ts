import { StatusCodes } from "http-status-codes";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

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

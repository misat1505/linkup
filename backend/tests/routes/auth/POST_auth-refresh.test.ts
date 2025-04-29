import { env } from "../../../src/config/env";
import { refreshTokenCookieName } from "../../../src/config/jwt-cookie";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /auth/refresh", () => {
  it("should refresh token", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(
        seed.users[0].id,
        env.REFRESH_TOKEN_SECRET
      );

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", `${refreshTokenCookieName}=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});

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
        .set("Cookie", `${refreshTokenCookieName}=${token}`)
        .expect(200);

      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  it("should fail if no refresh token in cookie", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app).post("/auth/refresh").expect(400);
    });
  });

  it("should fail if user doesn't exist", async () => {
    await testWithTransaction(async ({ app }) => {
      const token = TestHelpers.createToken(
        "invalid-user-id",
        env.REFRESH_TOKEN_SECRET
      );

      await request(app)
        .post("/auth/refresh")
        .set("Cookie", `${refreshTokenCookieName}=${token}`)
        .expect(404);
    });
  });
});

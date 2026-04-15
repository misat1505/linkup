import { StatusCodes } from "http-status-codes";
import { env } from "@/config/env";
import { refreshTokenCookieName } from "@/config/jwt-cookie";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[POST] /auth/refresh", () => {
  it("refreshes authentication token", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(
        seed.users[0].id,
        env.REFRESH_TOKEN_SECRET
      );

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", `${refreshTokenCookieName}=${token}`)
        .expect(StatusCodes.OK);

      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  it("fails without refresh token in cookie", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app).post("/auth/refresh").expect(StatusCodes.UNAUTHORIZED);
    });
  });

  it("fails for non-existent user", async () => {
    await testWithTransaction(async ({ app }) => {
      const token = TestHelpers.createToken(
        "invalid-user-id",
        env.REFRESH_TOKEN_SECRET
      );

      await request(app)
        .post("/auth/refresh")
        .set("Cookie", `${refreshTokenCookieName}=${token}`)
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });
});

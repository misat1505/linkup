import { StatusCodes } from "http-status-codes";
import { User } from "@/types/User";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /auth/login", () => {
  it("logs in user with valid credentials", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const user = seed.users[0];
      const res = await request(app)
        .post("/auth/login")
        .send({
          login: user.login,
          password: "pass2",
        })
        .expect(StatusCodes.OK);
      User.strict().parse(res.body.user);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  it("fails with incorrect password", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const user = seed.users[0];
      await request(app)
        .post("/auth/login")
        .send({
          login: user.login,
          password: "bad-password",
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  it("fails for non-existent login", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app)
        .post("/auth/login")
        .send({
          login: "bad-login",
          password: "pass2",
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  it("fails with invalid data", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app)
        .post("/auth/login")
        .send({
          login: "login",
        })
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

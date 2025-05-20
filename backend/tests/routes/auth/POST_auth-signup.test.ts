import { User } from "@/types/User";
import { mockFileStorage } from "@tests/utils/mocks";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";
import { TEST_FILENAME_PATH } from "@tests/utils/constants";
import { StatusCodes } from "http-status-codes";

describe("[POST] /auth/signup", () => {
  it("signs up new user", async () => {
    await testWithTransaction(async ({ app }) => {
      const login = "valid_login";
      const password = "valid_password";

      const res = await request(app)
        .post("/auth/signup")
        .send({
          firstName: "Melon",
          lastName: "Muzg",
          login,
          password,
        })
        .expect(StatusCodes.CREATED);
      User.strict().parse(res.body.user);
      expect(res.headers["set-cookie"]).toBeDefined();

      const res2 = await request(app)
        .post("/auth/login")
        .send({
          login,
          password,
        })
        .expect(StatusCodes.OK);

      User.strict().parse(res2.body.user);
      expect(res2.headers["set-cookie"]).toBeDefined();
    });
  });

  it("signs up new user with image", async () => {
    await testWithTransaction(async ({ app }) => {
      const login = "valid_login";
      const password = "valid_password";

      const res = await request(app)
        .post("/auth/signup")
        .field("firstName", "Melon")
        .field("lastName", "Muzg")
        .field("login", login)
        .field("password", password)
        .attach("file", TEST_FILENAME_PATH)
        .expect(StatusCodes.CREATED);

      User.strict().parse(res.body.user);
      expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
    });
  });

  it("fails if login is taken", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      await request(app)
        .post("/auth/signup")
        .send({
          firstName: "Melon",
          lastName: "Muzg",
          login: seed.users[0].login,
          password: "valid_password",
        })
        .expect(StatusCodes.CONFLICT);
    });
  });

  it("fails with invalid data", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app)
        .post("/auth/signup")
        .send({
          firstName: "Melon",
          login: "valid_login",
          password: "valid_password",
        })
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

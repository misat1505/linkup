import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";
import { User } from "../../../src/types/User";
import { TEST_FILENAME_PATH } from "../../utils/constants";
import { StatusCodes } from "http-status-codes";

describe("[PUT] /auth/user", () => {
  it("updates user profile", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const newUser = {
        login: "login2",
        password: "pass2",
        firstName: "new first name",
        lastName: "new last name",
      };
      const res = await request(app)
        .put("/auth/user")
        .field("login", newUser.login)
        .field("password", newUser.password)
        .field("firstName", newUser.firstName)
        .field("lastName", newUser.lastName)
        .attach("file", TEST_FILENAME_PATH)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      User.strict().parse(res.body.user);

      expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);

      const res2 = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`);

      const getUser = res2.body.user;
      User.strict().parse(getUser);
      expect(getUser.firstName).toBe(newUser.firstName);
      expect(getUser.lastName).toBe(newUser.lastName);
    });
  });

  it("changes user login", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .put("/auth/user")
        .send({
          login: "login76",
          password: "pass2",
          firstName: "new first name",
          lastName: "new last name",
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);
    });
  });

  it("fails if new login is taken", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .put("/auth/user")
        .send({
          login: seed.users[1].login,
          password: "pass2",
          firstName: "new first name",
          lastName: "new last name",
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.CONFLICT);
    });
  });

  it("fails with invalid data", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .put("/auth/user")
        .send({
          firstName: "Melon",
          login: "valid_login",
          password: "valid_password",
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

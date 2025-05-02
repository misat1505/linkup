import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";
import path from "path";
import { User } from "../../../src/types/User";

jest.mock("../../../src/lib/FileStorage");

describe("[PUT] /auth/user", () => {
  it("should update user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
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
        .attach("file", path.join(__dirname, "..", "..", "utils", "image.jpg"))
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

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

  it("should allow to change login", async () => {
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
        .expect(201);
    });
  });

  it("should fail if login already taken", async () => {
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
        .expect(409);
    });
  });

  it("should fail with bad data", async () => {
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
        .expect(400);
    });
  });
});

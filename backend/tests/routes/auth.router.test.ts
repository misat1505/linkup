import request from "supertest";
import path from "path";
import { isUser } from "../../src/types/guards/user.guard";
import { env } from "../../src/config/env";
import { refreshTokenCookieName } from "../../src/config/jwt-cookie";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFileStorage } from "../utils/mocks";
import { TestHelpers } from "../utils/helpers";
import { User } from "../../src/types/User";

describe("auth router", () => {
  describe("[PUT] /user", () => {
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
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"))
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(201);
        expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(
          true
        );

        expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);

        const res2 = await request(app)
          .get("/auth/user")
          .set("Authorization", `Bearer ${token}`);

        const getUser = res2.body.user;
        expect(isUser(getUser, { allowStringifiedDates: true })).toBe(true);
        expect(getUser.firstName).toBe(newUser.firstName);
        expect(getUser.lastName).toBe(newUser.lastName);
      });
    });
  });

  describe("[POST] /login", () => {
    it("should login", async () => {
      await testWithTransaction(async ({ app }) => {
        const res = await request(app).post("/auth/login").send({
          login: "login2",
          password: "pass2",
        });
        expect(res.statusCode).toEqual(200);
        expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(
          true
        );
        expect(res.headers["set-cookie"]).toBeDefined();
      });
    });
  });

  describe("[POST] /signup", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should sign up", async () => {
      await testWithTransaction(async ({ app }) => {
        const login = "valid_login";
        const password = "valid_password";

        const res = await request(app).post("/auth/signup").send({
          firstName: "Melon",
          lastName: "Muzg",
          login,
          password,
        });
        expect(res.statusCode).toEqual(201);
        expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(
          true
        );
        expect(res.headers["set-cookie"]).toBeDefined();

        const res2 = await request(app).post("/auth/login").send({
          login,
          password,
        });

        expect(res2.statusCode).toBe(200);
        expect(isUser(res2.body.user, { allowStringifiedDates: true })).toBe(
          true
        );
        expect(res2.headers["set-cookie"]).toBeDefined();
      });
    });

    it("should sign up with image", async () => {
      await testWithTransaction(async ({ app }) => {
        app.services.fileStorage = mockFileStorage as any;
        const login = "valid_login";
        const password = "valid_password";

        const res = await request(app)
          .post("/auth/signup")
          .field("firstName", "Melon")
          .field("lastName", "Muzg")
          .field("login", login)
          .field("password", password)
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        expect(res.statusCode).toEqual(201);
        expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(
          true
        );

        expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("[POST] /refresh", () => {
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

  describe("[POST] /logout", () => {
    it("should logout user", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .post("/auth/logout")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
      });
    });
  });

  describe("[GET] /user", () => {
    it("should get user", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .get("/auth/user")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        User.strict().parse(res.body.user);
      });
    });
  });
});

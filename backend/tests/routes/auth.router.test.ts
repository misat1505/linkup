import request from "supertest";
import app from "../../src/app";
import fs from "fs";
import path from "path";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { VALID_USER_ID } from "../utils/constants";
import { isUser } from "../../src/types/guards/user.guard";
import { env } from "../../src/config/env";
import { refreshTokenCookieName } from "../../src/config/jwt-cookie";

describe("auth router", () => {
  const token = TokenProcessor.encode(
    { userId: VALID_USER_ID },
    env.ACCESS_TOKEN_SECRET
  );

  describe("[PUT] /user", () => {
    it("should update user", async () => {
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
      expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(true);

      const { photoURL } = res.body.user;

      const pathToImage = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "avatars",
        photoURL
      );
      expect(fs.existsSync(pathToImage)).toBe(true);

      const res2 = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`);

      const getUser = res2.body.user;
      expect(isUser(getUser, { allowStringifiedDates: true })).toBe(true);
      expect(getUser.firstName).toBe(newUser.firstName);
      expect(getUser.lastName).toBe(newUser.lastName);

      fs.unlinkSync(pathToImage);
    });
  });

  describe("[POST] /login", () => {
    it("should login", async () => {
      const res = await request(app).post("/auth/login").send({
        login: "login2",
        password: "pass2",
      });
      expect(res.statusCode).toEqual(200);
      expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("[POST] /signup", () => {
    it("should sign up", async () => {
      const login = "valid_login";
      const password = "valid_password";

      const res = await request(app).post("/auth/signup").send({
        firstName: "Melon",
        lastName: "Muzg",
        login,
        password,
      });
      expect(res.statusCode).toEqual(201);
      expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(true);
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

    it("should sign up with image", async () => {
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
      expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(true);
      const { photoURL } = res.body.user;

      const pathToImage = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "avatars",
        photoURL
      );
      expect(fs.existsSync(pathToImage)).toBe(true);
      fs.unlinkSync(pathToImage);
    });
  });

  describe("[POST] /refresh", () => {
    it("should refresh token", async () => {
      const token = TokenProcessor.encode(
        { userId: VALID_USER_ID },
        env.REFRESH_TOKEN_SECRET
      );

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", `${refreshTokenCookieName}=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("[POST] /logout", () => {
    it("should logout user", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("[GET] /user", () => {
    it("should get user", async () => {
      const res = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(isUser(res.body.user, { allowStringifiedDates: true })).toBe(true);
    });
  });
});

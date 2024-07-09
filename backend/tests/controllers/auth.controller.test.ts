import request from "supertest";
import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
  signupUser,
} from "../../src/controllers/auth.controller";
import { UserService } from "../../src/services/UserService";
import { JwtHandler } from "../../src/lib/JwtHandler";
import { Hasher } from "../../src/lib/Hasher";
import { User } from "../../src/models/User";

jest.mock("../../src/services/UserService");
jest.mock("../../src/lib/JwtHandler");

describe("Auth Controllers", () => {
  const app = express();
  app.use(express.json());
  app.post("/signup", signupUser);
  app.post("/login", loginUser);
  app.post("/refresh", refreshToken);
  app.post("/logout", logoutUser);
  app.get("/user", getUser);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signupUser", () => {
    it("should sign up a new user", async () => {
      const mockUser: User = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: Hasher.hash("password123"),
        photoURL: null,
      };

      (UserService.isLoginTaken as jest.Mock).mockResolvedValue(false);
      (UserService.insertUser as jest.Mock).mockResolvedValue(1);
      (JwtHandler.encode as jest.Mock).mockReturnValue("fake_jwt_token");

      const response = await request(app).post("/signup").send({
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(mockUser);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should not sign up a user with an existing login", async () => {
      (UserService.isLoginTaken as jest.Mock).mockResolvedValue(true);

      const response = await request(app).post("/signup").send({
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Login already taken.");
    });
  });

  describe("loginUser", () => {
    it("should log in a user with valid credentials", async () => {
      const mockUser = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "hashed_password",
        photoURL: "file.jpg",
      };

      (UserService.loginUser as jest.Mock).mockResolvedValue(mockUser);
      (JwtHandler.encode as jest.Mock).mockReturnValue("fake_jwt_token");

      const response = await request(app).post("/login").send({
        login: "john_doe",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should not log in a user with invalid credentials", async () => {
      (UserService.loginUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        login: "john_doe",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid login or password.");
    });
  });

  describe("refreshToken", () => {
    it("should refresh a token", async () => {
      (JwtHandler.encode as jest.Mock).mockReturnValue("new_fake_jwt_token");

      const response = await request(app)
        .post("/refresh")
        .send({ token: { userId: 1 } });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Successfully refreshed token.");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("logoutUser", () => {
    it("should log out a user", async () => {
      (JwtHandler.encode as jest.Mock).mockReturnValue("logout_jwt_token");

      const response = await request(app)
        .post("/logout")
        .send({ token: { userId: 1 } });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Successfully logged out.");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("getUser", () => {
    it("should get a user by id", async () => {
      const mockUser = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "hashed_password",
        photoURL: "file.jpg",
      };

      (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/user")
        .send({ token: { userId: 1 } });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it("should return 404 if user not found", async () => {
      (UserService.getUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get("/user")
        .send({ token: { userId: 1 } });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });
  });
});

import request from "supertest";
import express from "express";
import { UserService } from "../../src/services/UserService";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { User, UserWithCredentials } from "../../src/types/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { isUser } from "../../src/types/guards/user.guard";
import { VALID_USER_ID } from "../utils/constants";
import { signupController } from "../../src/controllers/auth/signup.controller";
import { loginController } from "../../src/controllers/auth/login.controller";
import { refreshTokenController } from "../../src/controllers/auth/refreshToken.controller";
import { logoutController } from "../../src/controllers/auth/logout.controller";
import { getSelfController } from "../../src/controllers/auth/getSelf.controller";
import { updateSelfController } from "../../src/controllers/auth/updateSelf.controller";

jest.mock("uuid");
jest.mock("bcryptjs");
jest.mock("../../src/services/UserService");
jest.mock("../../src/lib/TokenProcessor");

describe("Auth Controllers", () => {
  const app = express();
  app.use(express.json());
  app.post("/signup", signupController);
  app.post("/login", loginController);
  app.post("/refresh", refreshTokenController);
  app.post("/logout", logoutController);
  app.get("/user", getSelfController);
  app.put("/user", updateSelfController);

  const removeCredentials = (
    userWithCredentials: UserWithCredentials
  ): User => {
    const { login, password, salt, ...rest } = userWithCredentials;
    const user: User = { ...rest };
    return user;
  };

  beforeAll(() => {
    (UserService.removeCredentials as jest.Mock).mockImplementation(
      removeCredentials
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUser", () => {
    it("should update user", async () => {
      (UserService.getUserByLogin as jest.Mock).mockResolvedValue({
        id: "some-id",
        login: "some-login",
        photoURL: "some-url",
      });

      const response = await request(app)
        .put("/user")
        .send({
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: VALID_USER_ID },
        });

      expect(isUser(response.body.user, { allowStringifiedDates: true })).toBe(
        true
      );
    });

    it("should update user when same id", async () => {
      (UserService.getUserByLogin as jest.Mock).mockResolvedValue({
        id: VALID_USER_ID,
        login: "some-login",
        photoURL: "some-url",
      });

      const response = await request(app)
        .put("/user")
        .send({
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: VALID_USER_ID },
        });

      expect(isUser(response.body.user, { allowStringifiedDates: true })).toBe(
        true
      );
    });

    it("shouldn't allow 2 users of the same login", async () => {
      (UserService.getUserByLogin as jest.Mock).mockResolvedValue({
        id: "some-id",
        login: "login1",
        photoURL: "some-url",
      });

      const response = await request(app)
        .put("/user")
        .send({
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: VALID_USER_ID },
        });

      expect(response.statusCode).toBe(409);
    });
  });

  describe("signupUser", () => {
    it("should sign up a new user", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("fixed-uuid");
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");

      (UserService.isLoginTaken as jest.Mock).mockResolvedValue(false);
      (TokenProcessor.encode as jest.Mock).mockReturnValue("fake_jwt_token");

      const response = await request(app).post("/signup").send({
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "password123",
      });

      expect(isUser(response.body.user, { allowStringifiedDates: true })).toBe(
        true
      );
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
      const id = uuidv4();
      const salt = "salt";

      const mockUser: UserWithCredentials = {
        id,
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password:
          "7a37b85c8918eac19a9089c0fa5a2ab4dce3f90528dcdeec108b23ddf3607b99",
        salt,
        photoURL: "file.jpg",
        lastActive: new Date(),
      };

      (UserService.getUserByLogin as jest.Mock).mockResolvedValue(mockUser);
      (TokenProcessor.encode as jest.Mock).mockReturnValue("fake_jwt_token");

      const response = await request(app).post("/login").send({
        login: "john_doe",
        password: "password",
      });

      expect(isUser(response.body.user, { allowStringifiedDates: true })).toBe(
        true
      );
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should not log in a user with invalid login", async () => {
      (UserService.getUserByLogin as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        login: "john_doe",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid login.");
    });

    it("should not log in a user with invalid password", async () => {
      const mockUser: UserWithCredentials = {
        id: uuidv4(),
        firstName: "John",
        lastName: "Doe",
        login: "login1",
        password:
          "7a37b85c8918eac19a9089c0fa5a2ab4dce3f90528dcdeec108b23ddf3607b99",
        salt: "salt",
        photoURL: "file.jpg",
        lastActive: new Date(),
      };
      (UserService.getUserByLogin as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post("/login").send({
        login: "login1",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid password.");
    });
  });

  describe("refreshToken", () => {
    it("should refresh a token", async () => {
      (TokenProcessor.encode as jest.Mock).mockReturnValue(
        "new_fake_jwt_token"
      );

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
      (TokenProcessor.encode as jest.Mock).mockReturnValue("logout_jwt_token");

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
      const id = uuidv4();
      const salt = "salt";

      const mockUser: UserWithCredentials = {
        id,
        firstName: "John",
        lastName: "Doe",
        login: "john_doe",
        password: "hashed_password",
        salt,
        photoURL: "file.jpg",
        lastActive: new Date(),
      };

      (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/user")
        .send({ token: { userId: id } });

      expect(isUser(response.body.user, { allowStringifiedDates: true })).toBe(
        true
      );
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

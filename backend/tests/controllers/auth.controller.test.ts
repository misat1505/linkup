import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { UserWithCredentials } from "../../src/types/User";
import { v4 as uuidv4 } from "uuid";
import { VALID_USER_ID } from "../utils/constants";
import { signupController } from "../../src/controllers/auth/signup.controller";
import { loginController } from "../../src/controllers/auth/login.controller";
import { refreshTokenController } from "../../src/controllers/auth/refreshToken.controller";
import { logoutController } from "../../src/controllers/auth/logout.controller";
import { getSelfController } from "../../src/controllers/auth/getSelf.controller";
import { updateSelfController } from "../../src/controllers/auth/updateSelf.controller";
import { seedProvider } from "../utils/seedProvider";
import { mockRequest, mockResponse, mockUserService } from "../utils/mocks";

jest.mock("../../src/lib/TokenProcessor");

describe("Auth Controllers", () => {
  describe("updateUser", () => {
    it("should update user", async () => {
      await seedProvider(async (seed) => {
        mockUserService.getUserByLogin.mockResolvedValue({
          id: "some-id",
          login: "some-login",
          photoURL: "some-url",
        });

        const req = mockRequest({
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
            token: { userId: seed.users[0].id },
          },
        });
        const res = mockResponse();
        await updateSelfController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(201);
      });
    });

    it("should update user when same id", async () => {
      await seedProvider(async (seed) => {
        mockUserService.getUserByLogin.mockResolvedValue({
          id: seed.users[0].id,
          login: "some-login",
          photoURL: "some-url",
        });

        const req = mockRequest({
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
            token: { userId: VALID_USER_ID },
          },
        });
        const res = mockResponse();

        await updateSelfController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(201);
      });
    });

    it("shouldn't allow 2 users of the same login", async () => {
      await seedProvider(async (seed) => {
        mockUserService.getUserByLogin.mockResolvedValue({
          id: "some-id",
          login: "login1",
          photoURL: "some-url",
        });

        const req = mockRequest({
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
            token: { userId: seed.users[0].id },
          },
        });
        const res = mockResponse();

        await updateSelfController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(409);
      });
    });
  });

  describe("signupUser", () => {
    it("should sign up a new user", async () => {
      mockUserService.isLoginTaken.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "john_doe",
          password: "password123",
        },
      });
      const res = mockResponse();

      await signupController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalled();
    });

    it("should not sign up a user with an existing login", async () => {
      mockUserService.isLoginTaken.mockResolvedValue(true);

      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "john_doe",
          password: "password123",
        },
      });
      const res = mockResponse();

      await signupController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.cookie).not.toHaveBeenCalled();
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

      mockUserService.getUserByLogin.mockResolvedValue(mockUser);

      const req = mockRequest({
        body: { login: "john_doe", password: "password" },
      });
      const res = mockResponse();

      await loginController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalled();
    });

    it("should not log in a user with invalid login", async () => {
      mockUserService.getUserByLogin.mockResolvedValue(null);

      const req = mockRequest({
        body: { login: "john_doe", password: "wrong_password" },
      });
      const res = mockResponse();

      await loginController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.cookie).not.toHaveBeenCalled();
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
      mockUserService.getUserByLogin.mockResolvedValue(mockUser);

      const req = mockRequest({
        body: { login: "john_doe", password: "wrong_password" },
      });
      const res = mockResponse();

      await loginController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe("refreshToken", () => {
    it("should refresh a token", async () => {
      (TokenProcessor.encode as jest.Mock).mockReturnValue(
        "new_fake_jwt_token"
      );

      const req = mockRequest({ body: { token: { userId: 1 } } });
      const res = mockResponse();

      refreshTokenController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: expect.any(String) })
      );
      expect(res.cookie).toHaveBeenCalled();
    });
  });

  describe("logoutUser", () => {
    it("should log out a user", async () => {
      (TokenProcessor.encode as jest.Mock).mockReturnValue("logout_jwt_token");

      const req = mockRequest({ body: { token: { userId: 1 } } });
      const res = mockResponse();

      logoutController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.clearCookie).toHaveBeenCalled();
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

      mockUserService.getUser.mockResolvedValue(mockUser);

      const req = mockRequest({ body: { token: { userId: id } } });
      const res = mockResponse();

      await getSelfController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if user not found", async () => {
      mockUserService.getUser.mockResolvedValue(null);

      const req = mockRequest({ body: { token: { userId: 1 } } });
      const res = mockResponse();

      await getSelfController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

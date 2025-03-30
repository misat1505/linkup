import express from "express";
import { UserService } from "../../src/services/UserService";
import { USER_WITHOUT_CREDENTIALS } from "../utils/constants";
import request from "supertest";
import { User } from "../../src/types/User";
import { searchUserController } from "../../src/controllers/user/searchUser.controller";
import i18next from "../../src/i18n";
import middleware from "i18next-http-middleware";

jest.mock("../../src/services/UserService");

describe("User controllers", () => {
  const app = express();
  app.use(express.json());
  app.use(middleware.handle(i18next));
  app.get("/search", searchUserController);

  describe("searchUser", () => {
    it("should return users", async () => {
      (UserService.searchUsers as jest.Mock).mockResolvedValue([
        USER_WITHOUT_CREDENTIALS,
      ]);

      const users: (Omit<User, "lastActive"> & { lastActive: string })[] = [
        USER_WITHOUT_CREDENTIALS,
      ].map(({ lastActive, ...rest }) => ({
        lastActive: lastActive.toISOString(),
        ...rest,
      }));

      const response = await request(app).get("/search?term=abc");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ users });
    });

    it("fails if term not provided", async () => {
      (UserService.searchUsers as jest.Mock).mockResolvedValue([
        USER_WITHOUT_CREDENTIALS,
      ]);

      const response = await request(app).get("/search");
      expect(response.statusCode).toBe(400);
    });

    it("fails if term provided more than once", async () => {
      (UserService.searchUsers as jest.Mock).mockResolvedValue([
        USER_WITHOUT_CREDENTIALS,
      ]);

      const response = await request(app).get("/search?term=abc&term=dbc");
      expect(response.statusCode).toBe(400);
    });
  });
});

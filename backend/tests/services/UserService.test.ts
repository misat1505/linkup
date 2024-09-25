import { UserWithCredentials } from "../../src/types/User";
import { UserService } from "../../src/services/UserService";
import { VALID_USER_ID } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import {
  isUser,
  isUserWithCredentials,
} from "../../src/types/guards/user.guard";

describe("UserService", () => {
  describe("searchUsers", () => {
    it("should return users fitting given term", async () => {
      const result = await UserService.searchUsers("Kyli");
      expect(result.length).toBe(1);
      result.forEach((user) => {
        expect(isUser(user)).toBe(true);
      });
    });
  });

  describe("isLoginTaken", () => {
    it("should return true if taken", async () => {
      const result = await UserService.isLoginTaken("login2");
      expect(result).toBe(true);
    });

    it("should return false if not taken", async () => {
      const result = await UserService.isLoginTaken("not_taken");
      expect(result).toBe(false);
    });
  });

  describe("insertUser", () => {
    it("should insert user", async () => {
      const login = "not_taken";
      const user: UserWithCredentials = {
        id: uuidv4(),
        login,
        password: "udgfyudsgfyd",
        firstName: "Melon",
        lastName: "Musg",
        salt: await bcrypt.genSalt(10),
        photoURL: null,
        lastActive: new Date(),
      };

      await UserService.insertUser(user);
      expect(true).toBe(true); // check if no error
    });
  });

  describe("getUserByLogin", () => {
    it("should return user if existent", async () => {
      const user = await UserService.getUserByLogin("login2");
      expect(user).not.toBe(null);
      expect(isUserWithCredentials(user)).toBe(true);
    });

    it("should return null if not existent", async () => {
      const user = await UserService.getUserByLogin("not_existent");
      expect(user).toBe(null);
    });
  });

  describe("getUser", () => {
    it("should return user if existent", async () => {
      const user = await UserService.getUser(VALID_USER_ID);
      expect(user).not.toBe(null);
      expect(isUserWithCredentials(user)).toBe(true);
    });

    it("should return null if not existent", async () => {
      const user = await UserService.getUser("invalid");
      expect(user).toBe(null);
    });
  });
});

import { Hasher } from "../../src/lib/Hasher";
import { User } from "../../src/models/User";
import { UserService } from "../../src/services/UserService";
import { VALID_USER_ID } from "../utils/constants";
import { testsWithTransactions } from "../utils/setup";
import { v4 as uuidv4 } from "uuid";

describe("UserService", () => {
  testsWithTransactions();

  describe("isLoginTaken", () => {
    it("should return true if taken", async () => {
      const result = await UserService.isLoginTaken("login1");
      expect(result).toBe(true);
    });

    it("should return false if not taken", async () => {
      const result = await UserService.isLoginTaken("not_taken");
      expect(result).toBe(false);
    });
  });

  describe("insertUser", () => {
    it("should insert user", async () => {
      const user: User = {
        id: uuidv4(),
        login: "not_taken",
        password: "udgfyudsgfyd",
        firstName: "Melon",
        lastName: "Musg",
        photoURL: null,
      };

      await UserService.insertUser(user);
      expect(true).toBe(true); // check if no error
    });
  });

  describe("loginUser", () => {
    it("should return user if existent", async () => {
      const user = await UserService.loginUser("login1", Hasher.hash("pass1"));
      expect(user).not.toBe(null);
    });

    it("should return null if not existent", async () => {
      const user = await UserService.loginUser(
        "not_existent",
        Hasher.hash("pass1")
      );
      expect(user).toBe(null);
    });
  });

  describe("getUser", () => {
    it("should return user if existent", async () => {
      const user = await UserService.getUser(VALID_USER_ID);
      expect(user).not.toBe(null);
    });

    it("should return null if not existent", async () => {
      const user = await UserService.getUser("invalid");
      expect(user).toBe(null);
    });
  });
});

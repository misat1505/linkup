import { Hasher } from "../../src/lib/Hasher";
import { User } from "../../src/models/User";
import { UserService } from "../../src/services/UserService";
import { testsWithTransactions } from "../utils/setup";

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
      const user: Omit<User, "id"> = {
        login: "not_taken",
        password: "udgfyudsgfyd",
        firstName: "Melon",
        lastName: "Musg",
        photoURL: null,
      };

      const id = await UserService.insertUser(user);
      expect(id).not.toBe(null);
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
      const user = await UserService.getUser(14);
      expect(user).not.toBe(null);
    });

    it("should return null if not existent", async () => {
      const user = await UserService.getUser(0);
      expect(user).toBe(null);
    });
  });
});

import { User, UserWithCredentials } from "../../src/types/User";
import { UserService } from "../../src/services/UserService";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("UserService", () => {
  describe("searchUsers", () => {
    it("should return users fitting given term", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const result = await userService.searchUsers("Kyli");
        expect(result.length).toBe(1);
        result.forEach((user) => {
          User.strict().parse(user);
        });
      });
    });
  });

  describe("isLoginTaken", () => {
    it("should return true if taken", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const result = await userService.isLoginTaken("login2");
        expect(result).toBe(true);
      });
    });

    it("should return false if not taken", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const result = await userService.isLoginTaken("not_taken");
        expect(result).toBe(false);
      });
    });
  });

  describe("insertUser", () => {
    it("should insert user", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
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

        await userService.insertUser(user);
        expect(true).toBe(true); // check if no error
      });
    });
  });

  describe("getUserByLogin", () => {
    it("should return user if existent", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUserByLogin("login2");
        expect(user).not.toBe(null);
        UserWithCredentials.strict().parse(user);
      });
    });

    it("should return null if not existent", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUserByLogin("not_existent");
        expect(user).toBe(null);
      });
    });
  });

  describe("getUser", () => {
    it("should return user if existent", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const userService = new UserService(tx);
        const user = await userService.getUser(seed.users[0].id);
        expect(user).not.toBe(null);
        UserWithCredentials.strict().parse(user);
      });
    });

    it("should return null if not existent", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUser("invalid");
        expect(user).toBe(null);
      });
    });
  });
});

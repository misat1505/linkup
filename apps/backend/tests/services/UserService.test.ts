import { User, UserWithCredentials } from "@/types/User";
import { UserService } from "@/services/UserService";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("UserService", () => {
  describe("searchUsers", () => {
    it("retrieves users matching search term", async () => {
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
    it("confirms login is taken", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const userService = new UserService(tx);
        const result = await userService.isLoginTaken(seed.users[0].login);
        expect(result).toBeTruthy();
      });
    });

    it("denies login is taken", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const result = await userService.isLoginTaken("not_taken");
        expect(result).toBeFalsy();
      });
    });
  });

  describe("insertUser", () => {
    it("inserts new user", async () => {
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
      });
    });
  });

  describe("getUserByLogin", () => {
    it("retrieves existing user by login", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUserByLogin("login2");
        expect(user).not.toBeNull();
        UserWithCredentials.strict().parse(user);
      });
    });

    it("returns null for non-existent user by login", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUserByLogin("not_existent");
        expect(user).toBeNull();
      });
    });
  });

  describe("getUser", () => {
    it("retrieves existing user by ID", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const userService = new UserService(tx);
        const user = await userService.getUser(seed.users[0].id);
        expect(user).not.toBeNull();
        UserWithCredentials.strict().parse(user);
      });
    });

    it("returns null for non-existent user by ID", async () => {
      await testWithTransaction(async ({ tx }) => {
        const userService = new UserService(tx);
        const user = await userService.getUser("invalid");
        expect(user).toBeNull();
      });
    });
  });
});

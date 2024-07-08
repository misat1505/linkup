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
});

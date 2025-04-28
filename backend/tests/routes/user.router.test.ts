import { isUser } from "../../src/types/guards/user.guard";
import request from "supertest";
import { testWithTransaction } from "../utils/testWithTransaction";
import { TestHelpers } from "../utils/helpers";

describe("user router", () => {
  describe("[GET] /search", () => {
    it("should return users", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const response = await request(app)
          .get("/users/search?term=Kylian")
          .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.users.length).toBe(1);
        response.body.users.forEach((user: any) => {
          expect(isUser(user, { allowStringifiedDates: true })).toBe(true);
        });
      });
    });
  });
});

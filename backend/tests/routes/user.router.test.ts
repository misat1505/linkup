import app from "../../src/app";
import { JwtHandler } from "../../src/lib/JwtHandler";
import { isUser } from "../../src/types/guards/user.guard";
import { VALID_USER_ID } from "../utils/constants";
import request from "supertest";

describe("user router", () => {
  const token = JwtHandler.encode({ userId: VALID_USER_ID });

  describe("[GET] /search", () => {
    it("should return users", async () => {
      const response = await request(app)
        .get("/users/search?term=Kylian")
        .set("Cookie", `token=${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.users.length).toBe(1);
      response.body.users.forEach((user: any) => {
        expect(isUser(user, { allowStringifiedDates: true })).toBe(true);
      });
    });
  });
});

import app from "../../src/app";
import { env } from "../../src/config/env";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { isUser } from "../../src/types/guards/user.guard";
import { VALID_USER_ID } from "../utils/constants";
import request from "supertest";

describe("user router", () => {
  const token = TokenProcessor.encode(
    { userId: VALID_USER_ID },
    env.ACCESS_TOKEN_SECRET
  );

  describe("[GET] /search", () => {
    it("should return users", async () => {
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

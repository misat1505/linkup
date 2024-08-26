import app from "../../src/app";
import { JwtHandler } from "../../src/lib/JwtHandler";
import { User } from "../../src/models/User";
import { USER_WITHOUT_CREDENTIALS, VALID_USER_ID } from "../utils/constants";
import request from "supertest";

describe("user router", () => {
  const token = JwtHandler.encode({ userId: VALID_USER_ID });

  describe("[GET] /search", () => {
    it("should return users", async () => {
      const users: Omit<User, "lastActive">[] = [USER_WITHOUT_CREDENTIALS].map(
        ({ lastActive, ...rest }) => ({
          ...rest,
        })
      );

      const response = await request(app)
        .get("/users/search?term=Kylian")
        .set("Cookie", `token=${token}`);
      expect(response.statusCode).toBe(200);
      const fetchedUsers = response.body.users.map(
        ({ lastActive, ...rest }: any) => ({
          ...rest,
        })
      );
      expect(fetchedUsers).toEqual(users);
    });
  });
});

import { StatusCodes } from "http-status-codes";
import { User } from "@/types/User";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /search", () => {
  it("returns users matching search term", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const response = await request(app)
        .get("/users/search?term=Kylian")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(response.body.users.length).toBe(1);
      response.body.users.forEach((user: any) => {
        User.strict().parse(user);
      });
    });
  });

  it("requires term query parameter", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .get("/users/search")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

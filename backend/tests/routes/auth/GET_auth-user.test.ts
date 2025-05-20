import { StatusCodes } from "http-status-codes";
import { User } from "@/types/User";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[GET] /auth/user", () => {
  it("retrieves authenticated user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      User.strict().parse(res.body.user);
    });
  });
});

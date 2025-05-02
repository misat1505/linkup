import { User } from "../../../src/types/User";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /auth/user", () => {
  it("should get user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      User.strict().parse(res.body.user);
    });
  });
});

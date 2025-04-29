import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /logout", () => {
  it("should logout user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});

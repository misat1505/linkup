import { User } from "../../../src/types/User";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /login", () => {
  it("should login", async () => {
    await testWithTransaction(async ({ app }) => {
      const res = await request(app).post("/auth/login").send({
        login: "login2",
        password: "pass2",
      });
      expect(res.statusCode).toEqual(200);
      User.strict().parse(res.body.user);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});

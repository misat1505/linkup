import request from "supertest";
import app from "../../src/app";
import { testsWithTransactions } from "../utils/setup";

describe("auth router", () => {
  testsWithTransactions();

  describe("/login", () => {
    it("should login", async () => {
      const res = await request(app).post("/auth/login").send({
        login: "login1",
        password: "pass1",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Successfully logged in.");
    });
  });

  describe("/signup", () => {
    it("should sign up", async () => {
      const res = await request(app).post("/auth/signup").send({
        firstName: "Melon",
        lastName: "Muzg",
        login: "valid_login",
        password: "valid_password",
      });
      expect(res.statusCode).toEqual(201);
    });
  });
});

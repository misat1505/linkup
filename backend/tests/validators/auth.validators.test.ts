import { ValidationChain } from "express-validator";
import express from "express";
import { validate } from "../../src/middlewares/validate";
import { loginRules } from "../../src/validators/auth.validator";
import request from "supertest";

const createTestServer = (validations: ValidationChain[]) => {
  const app = express();
  app.use(express.json());
  app.post("/test", validate(validations), (req, res) => {
    res.status(200).send("Validation passed");
  });
  return app;
};

describe("Auth validators", () => {
  describe("Login rules", () => {
    it("passes with correct data", async () => {
      const app = createTestServer(loginRules);
      const res = await request(app).post("/test").send({
        login: "login1",
        password: "pass1",
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Validation passed");
    });

    it("fails with data of bad types", async () => {
      const app = createTestServer(loginRules);
      const res = await request(app).post("/test").send({
        login: 11111,
        password: 22222,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Login has to be a string.",
          }),
          expect.objectContaining({
            msg: "Password has to be a string.",
          }),
        ])
      );
    });

    it("fails with no data", async () => {
      const app = createTestServer(loginRules);
      const res = await request(app).post("/test").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Login must be provided." }),
          expect.objectContaining({ msg: "Password must be provided." }),
        ])
      );
    });

    it("fails with data too short", async () => {
      const app = createTestServer(loginRules);
      const res = await request(app).post("/test").send({
        login: "logi",
        password: "pass",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Login must be between 5 and 50 characters long.",
          }),
          expect.objectContaining({
            msg: "Password must be at least 5 characters long.",
          }),
        ])
      );
    });

    it("fails with data too long", async () => {
      const app = createTestServer(loginRules);
      const res = await request(app)
        .post("/test")
        .send({
          login: "l".repeat(51),
          password: "pass1",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Login must be between 5 and 50 characters long.",
          }),
        ])
      );
    });
  });
});

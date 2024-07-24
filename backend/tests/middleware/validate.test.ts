import express from "express";
import request from "supertest";
import { body } from "express-validator";
import { validate } from "../../src/middlewares/validate";

describe("validate middleware", () => {
  const validationRules = [
    body("name").exists().withMessage("Name has to be given"),
  ];

  const app = express();
  app.use(express.json());
  app.post("/test", validate(validationRules), (req, res) => {
    res.status(200).send({ message: "Success" });
  });

  it("should go to next function if validation successful", async () => {
    const response = await request(app).post("/test").send({
      name: "Bob",
    });

    expect(response.statusCode).toBe(200);
  });

  it("returns errors if validation not successful", async () => {
    const response = await request(app).post("/test");

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBe(1);
  });
});

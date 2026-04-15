import request from "supertest";
import { testWithTransaction } from "./utils/testWithTransaction";

describe("i18n", () => {
  it("returns message in requested Accept-Language", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const data = [
        {
          locale: "en",
          text: "Login already taken.",
        },
        {
          locale: "de",
          text: "Login bereits vergeben.",
        },
        {
          locale: "es",
          text: "El inicio de sesión ya está en uso.",
        },
        {
          locale: "pl",
          text: "Login już zajęty.",
        },
        {
          locale: "ru",
          text: "Логин уже занят.",
        },
        {
          locale: "zh",
          text: "登录名已被占用。",
        },
      ];

      for (const item of data) {
        const response = await request(app)
          .post("/auth/signup")
          .set("Accept-Language", item.locale)
          .send({
            firstName: "Melon",
            lastName: "Muzg",
            login: seed.users[0].login,
            password: "password",
          });

        expect(response.body.message).toEqual(item.text);
      }
    });
  });

  it("defaults to English without Accept-Language header", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const response = await request(app).post("/auth/signup").send({
        firstName: "Melon",
        lastName: "Muzg",
        login: seed.users[0].login,
        password: "password",
      });

      expect(response.body.message).toEqual("Login already taken.");
    });
  });

  it("defaults to English for unsupported locale", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const response = await request(app)
        .post("/auth/signup")
        .set("Accept-Language", "bad")
        .send({
          firstName: "Melon",
          lastName: "Muzg",
          login: seed.users[0].login,
          password: "password",
        });

      expect(response.body.message).toEqual("Login already taken.");
    });
  });
});

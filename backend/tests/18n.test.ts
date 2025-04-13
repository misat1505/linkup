import request from "supertest";
import app from "../src/app";
import { USER } from "./utils/constants";

describe("18n", () => {
  it("should return message in language put in Accept-Language header", async () => {
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
          login: USER.login,
          password: "password",
        });

      expect(response.body.message).toEqual(item.text);
    }
  });

  it("defaults to english if no Accept-Language header", async () => {
    const response = await request(app).post("/auth/signup").send({
      firstName: "Melon",
      lastName: "Muzg",
      login: USER.login,
      password: "password",
    });

    expect(response.body.message).toEqual("Login already taken.");
  });

  it("defaults to english if locale passed in Accept-Language doesn't exists", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .set("Accept-Language", "bad")
      .send({
        firstName: "Melon",
        lastName: "Muzg",
        login: USER.login,
        password: "password",
      });

    expect(response.body.message).toEqual("Login already taken.");
  });
});

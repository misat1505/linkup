import { User } from "../../../src/types/User";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";
import path from "path";

jest.mock("../../../src/lib/FileStorage");

describe("[POST] /auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up", async () => {
    await testWithTransaction(async ({ app }) => {
      const login = "valid_login";
      const password = "valid_password";

      const res = await request(app).post("/auth/signup").send({
        firstName: "Melon",
        lastName: "Muzg",
        login,
        password,
      });
      expect(res.statusCode).toEqual(201);
      User.strict().parse(res.body.user);
      expect(res.headers["set-cookie"]).toBeDefined();

      const res2 = await request(app).post("/auth/login").send({
        login,
        password,
      });

      expect(res2.statusCode).toBe(200);
      User.strict().parse(res2.body.user);
      expect(res2.headers["set-cookie"]).toBeDefined();
    });
  });

  it("should sign up with image", async () => {
    await testWithTransaction(async ({ app }) => {
      app.services.fileStorage = mockFileStorage as any;
      const login = "valid_login";
      const password = "valid_password";

      const res = await request(app)
        .post("/auth/signup")
        .field("firstName", "Melon")
        .field("lastName", "Muzg")
        .field("login", login)
        .field("password", password)
        .attach("file", path.join(__dirname, "..", "..", "utils", "image.jpg"))
        .expect(201);

      User.strict().parse(res.body.user);
      expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
    });
  });

  it("should fail if login already taken", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const res = await request(app)
        .post("/auth/signup")
        .send({
          firstName: "Melon",
          lastName: "Muzg",
          login: seed.users[0].login,
          password: "valid_password",
        })
        .expect(409);
    });
  });

  it("should fail with bad data", async () => {
    await testWithTransaction(async ({ app }) => {
      await request(app)
        .post("/auth/signup")
        .send({
          firstName: "Melon",
          login: "valid_login",
          password: "valid_password",
        })
        .expect(400);
    });
  });
});

import path from "path";
import request from "supertest";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { User } from "../../src/types/User";
import { Message } from "../../src/types/Message";
import { env } from "../../src/config/env";
import { Application } from "express";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFileStorage } from "../utils/mocks";
import { TestHelpers } from "../utils/helpers";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../src/lib/FileStorage");

describe("file router", () => {
  async function createNewUser(app: Application) {
    const login = "valid_login";
    const password = "valid_password";

    const res = await request(app)
      .post("/auth/signup")
      .field("firstName", "Melon")
      .field("lastName", "Muzg")
      .field("login", login)
      .field("password", password)
      .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

    return res.body.user as User;
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("[GET] /:filename", () => {
    it("should allow everyone to access avatar", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const createdUser = await createNewUser(app);
        const tokens = TestHelpers.createTokens([
          seed.users[0].id,
          createdUser.id,
        ]);

        const res = await request(app)
          .get(`/files/${createdUser.photoURL}?filter=avatar`)
          .set("Authorization", `Bearer ${tokens[1]}`);
        expect(res.statusCode).toBe(200);

        const res2 = await request(app)
          .get(`/files/${createdUser.photoURL}?filter=avatar`)
          .set("Authorization", `Bearer ${tokens[0]}`);
        expect(res2.statusCode).toBe(200);
      });
    });

    it("should allow only people in chat see chat photo", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const createdUser = await createNewUser(app);
        const tokens = TestHelpers.createTokens([
          seed.users[0].id,
          createdUser.id,
        ]);

        const {
          body: { chat },
        } = await request(app)
          .post("/chats/group")
          .set("Authorization", `Bearer ${tokens[0]}`)
          .field("users[0]", seed.users[0].id)
          .field("users[1]", seed.users[1].id)
          .field("name", "chat name")
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        const res = await request(app)
          .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
          .set("Authorization", `Bearer ${tokens[0]}`);
        expect(res.statusCode).toBe(200);

        const user2Token = TokenProcessor.encode(
          {
            userId: seed.users[1].id,
          },
          env.ACCESS_TOKEN_SECRET
        );

        const res2 = await request(app)
          .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
          .set("Authorization", `Bearer ${user2Token}`);
        expect(res2.statusCode).toBe(200);

        const res3 = await request(app)
          .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
          .set("Authorization", `Bearer ${tokens[1]}`);
        expect(res3.statusCode).toBe(401);
      });
    });

    it("should allow only people in chat see files in chat message", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const createdUser = await createNewUser(app);
        const tokens = TestHelpers.createTokens([
          seed.users[0].id,
          createdUser.id,
        ]);

        const {
          body: { chat },
        } = await request(app)
          .post("/chats/group")
          .set("Authorization", `Bearer ${tokens[0]}`)
          .field("users[0]", seed.users[0].id)
          .field("name", "")
          .field("users[1]", seed.users[1].id);

        const {
          body: { message },
        } = await request(app)
          .post(`/chats/${chat.id}/messages`)
          .set("Authorization", `Bearer ${tokens[0]}`)
          .field("content", "message")
          .attach("files", Buffer.from("message file"), "file1.txt");

        const filename = (message as Message).files[0].url;

        const res = await request(app)
          .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
          .set("Authorization", `Bearer ${tokens[0]}`);
        expect(res.statusCode).toBe(200);

        const user2Token = TokenProcessor.encode(
          {
            userId: seed.users[1].id,
          },
          env.ACCESS_TOKEN_SECRET
        );

        const res2 = await request(app)
          .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
          .set("Authorization", `Bearer ${user2Token}`);
        expect(res2.statusCode).toBe(200);

        const res3 = await request(app)
          .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
          .set("Authorization", `Bearer ${tokens[1]}`);
        expect(res3.statusCode).toBe(401);
      });
    });

    it("should allow getting file from cache only by user which uploaded the file", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const res1 = await request(app)
          .post("/files/cache")
          .set("Authorization", `Bearer ${token}`)
          .attach("file", Buffer.from("message file"), "file1.txt");
        const newFileName = res1.body.file;

        const res2 = await request(app)
          .get(`/files/${newFileName}?filter=cache`)
          .set("Authorization", `Bearer ${token}`);
        expect(res2.statusCode).toBe(200);
      });
    });

    it("should allow everyone to access file from post", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const createdUser = await createNewUser(app);
        const tokens = TestHelpers.createTokens([
          seed.users[0].id,
          createdUser.id,
        ]);
        const postId = uuidv4();
        const filename = "file.txt";

        const res2 = await request(app)
          .get(`/files/${filename}?filter=post&post=${postId}`)
          .set("Authorization", `Bearer ${tokens[0]}`);
        expect(res2.statusCode).toBe(200);

        const res3 = await request(app)
          .get(`/files/${filename}?filter=post&post=${postId}`)
          .set("Authorization", `Bearer ${tokens[1]}`);
        expect(res3.statusCode).toBe(200);
      });
    });
  });

  describe("cache routes", () => {
    it("handles cache correctly", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        app.services.fileStorage = mockFileStorage as any;
        const token = TestHelpers.createToken(seed.users[0].id);

        const res1 = await request(app)
          .get("/files/cache")
          .set("Authorization", `Bearer ${token}`);

        const res2 = await request(app)
          .post("/files/cache")
          .set("Authorization", `Bearer ${token}`)
          .attach("file", Buffer.from("message file"), "file1.txt");
        const filename1 = res2.body.file;

        const res3 = await request(app)
          .get(`/files/${filename1}?filter=cache`)
          .set("Authorization", `Bearer ${token}`);
        expect(res3.statusCode).toBe(200);

        const res4 = await request(app)
          .delete(`/files/cache/${filename1}`)
          .set("Authorization", `Bearer ${token}`);
        expect(res4.statusCode).toBe(200);
      });
    });
  });
});

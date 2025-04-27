import path from "path";
import request from "supertest";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { VALID_USER_ID } from "../utils/constants";
import { User } from "../../src/types/User";
import { Message } from "../../src/types/Message";
import { env } from "../../src/config/env";
import { Application } from "express";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFileStorage } from "../utils/mocks";

jest.mock("../../src/lib/FileStorage");

const createTestUser = async (app: Application) => {
  const login = "valid_login";
  const password = "valid_password";

  const res = await request(app)
    .post("/auth/signup")
    .field("firstName", "Melon")
    .field("lastName", "Muzg")
    .field("login", login)
    .field("password", password)
    .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

  return res.body.user;
};

describe("file router", () => {
  const token = TokenProcessor.encode(
    { userId: VALID_USER_ID },
    env.ACCESS_TOKEN_SECRET
  );

  async function createNewUser(app: Application) {
    const user = await createTestUser(app);
    const token = TokenProcessor.encode(
      {
        userId: user.id,
      },
      env.ACCESS_TOKEN_SECRET
    );
    return { user, token } as { user: User; token: string };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("[GET] /:filename", () => {
    it("should allow everyone to access avatar", async () => {
      await testWithTransaction(async ({ app }) => {
        const { user: newlyCreatedUser, token: newlyCreatedUserToken } =
          await createNewUser(app);

        const res = await request(app)
          .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
          .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
        expect(res.statusCode).toBe(200);

        const res2 = await request(app)
          .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
          .set("Authorization", `Bearer ${token}`);
        expect(res2.statusCode).toBe(200);
      });
    });

    it("should allow only people in chat see chat photo", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const { token: newlyCreatedUserToken } = await createNewUser(app);
        const {
          body: { chat },
        } = await request(app)
          .post("/chats/group")
          .set("Authorization", `Bearer ${token}`)
          .field("users[0]", seed.users[0].id)
          .field("users[1]", seed.users[1].id)
          .field("name", "chat name")
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        const res = await request(app)
          .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
          .set("Authorization", `Bearer ${token}`);
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
          .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
        expect(res3.statusCode).toBe(401);
      });
    });

    it("should allow only people in chat see files in chat message", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const { token: newlyCreatedUserToken } = await createNewUser(app);
        const {
          body: { chat },
        } = await request(app)
          .post("/chats/group")
          .set("Authorization", `Bearer ${token}`)
          .field("users[0]", seed.users[0].id)
          .field("name", "")
          .field("users[1]", seed.users[1].id);

        const {
          body: { message },
        } = await request(app)
          .post(`/chats/${chat.id}/messages`)
          .set("Authorization", `Bearer ${token}`)
          .field("content", "message")
          .attach("files", Buffer.from("message file"), "file1.txt");

        const filename = (message as Message).files[0].url;

        const res = await request(app)
          .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
          .set("Authorization", `Bearer ${token}`);
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
          .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
        expect(res3.statusCode).toBe(401);
      });
    });

    it("should allow getting file from cache only by user which uploaded the file", async () => {
      await testWithTransaction(async ({ app }) => {
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
      await testWithTransaction(async ({ app }) => {
        const { token: newlyCreatedUserToken } = await createNewUser(app);
        const postId = "post-id";
        const filename = "file.txt";

        const res2 = await request(app)
          .get(`/files/${filename}?filter=post&post=${postId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(res2.statusCode).toBe(200);

        const res3 = await request(app)
          .get(`/files/${filename}?filter=post&post=${postId}`)
          .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
        expect(res3.statusCode).toBe(200);
      });
    });
  });

  describe("cache routes", () => {
    it("handles cache correctly", async () => {
      await testWithTransaction(async ({ app }) => {
        app.services.fileStorage = mockFileStorage as any;
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

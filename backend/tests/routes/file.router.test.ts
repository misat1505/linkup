import path from "path";
import fs from "fs";
import request from "supertest";
import app from "../../src/app";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { VALID_USER_ID } from "../utils/constants";
import { User } from "../../src/types/User";
import { Message } from "../../src/types/Message";
import { env } from "../../src/config/env";

let newlyCreatedUser: User;

const createTestUser = async () => {
  const login = "valid_login";
  const password = "valid_password";

  const res = await request(app)
    .post("/auth/signup")
    .field("firstName", "Melon")
    .field("lastName", "Muzg")
    .field("login", login)
    .field("password", password)
    .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

  newlyCreatedUser = res.body.user;
};

const deleteUserFile = () => {
  const filepath = path.join(
    __dirname,
    "..",
    "..",
    "files",
    "avatars",
    newlyCreatedUser.photoURL!
  );
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};

describe("file router", () => {
  const token = TokenProcessor.encode(
    { userId: VALID_USER_ID },
    env.ACCESS_TOKEN_SECRET
  );
  let newlyCreatedUserToken: string;

  beforeEach(async () => {
    await createTestUser();
    newlyCreatedUserToken = TokenProcessor.encode(
      {
        userId: newlyCreatedUser.id,
      },
      env.ACCESS_TOKEN_SECRET
    );
  });

  afterEach(() => {
    deleteUserFile();
  });

  describe("[GET] /:filename", () => {
    it("should allow everyone to access avatar", async () => {
      const res = await request(app)
        .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
        .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
      expect(res.statusCode).toBe(200);

      const res2 = await request(app)
        .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
        .set("Authorization", `Bearer ${token}`);
      expect(res2.statusCode).toBe(200);
    });

    it("should allow only people in chat see chat photo", async () => {
      const {
        body: { chat },
      } = await request(app)
        .post("/chats/group")
        .set("Authorization", `Bearer ${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("users[1]", "935719fa-05c4-42c4-9b02-2be3fefb6e61")
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      const res = await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);

      const user2Token = TokenProcessor.encode(
        {
          userId: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
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

      const filepath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "chats",
        chat.id,
        chat.photoURL
      );
      if (fs.existsSync(path.dirname(filepath)))
        fs.rmdirSync(path.dirname(filepath), { recursive: true });
    });

    it("should allow only people in chat see files in chat message", async () => {
      const {
        body: { chat },
      } = await request(app)
        .post("/chats/group")
        .set("Authorization", `Bearer ${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("name", "")
        .field("users[1]", "935719fa-05c4-42c4-9b02-2be3fefb6e61");

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
          userId: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
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

      const filepath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "chats",
        chat.id,
        filename
      );
      if (fs.existsSync(path.dirname(filepath)))
        fs.rmdirSync(path.dirname(filepath), { recursive: true });
    });

    it("should allow getting file from cache only by user which uploaded the file", async () => {
      const res1 = await request(app)
        .post("/files/cache")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("message file"), "file1.txt");
      const newFileName = res1.body.file;

      const res2 = await request(app)
        .get(`/files/${newFileName}?filter=cache`)
        .set("Authorization", `Bearer ${token}`);
      expect(res2.statusCode).toBe(200);

      const res3 = await request(app)
        .get(`/files/${newFileName}?filter=cache`)
        .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
      expect(res3.statusCode).toBe(404);
    });

    it("should allow everyone to access file from post", async () => {
      const postId = "post-id";
      const postFilesDir = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "posts",
        postId
      );

      const filename = "file.txt";

      fs.mkdirSync(postFilesDir, { recursive: true });
      fs.writeFileSync(
        path.join(postFilesDir, filename),
        Buffer.from("message file")
      );

      const res2 = await request(app)
        .get(`/files/${filename}?filter=post&post=${postId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res2.statusCode).toBe(200);

      const res3 = await request(app)
        .get(`/files/${filename}?filter=post&post=${postId}`)
        .set("Authorization", `Bearer ${newlyCreatedUserToken}`);
      expect(res3.statusCode).toBe(200);

      fs.rmdirSync(postFilesDir, { recursive: true });
    });
  });
});

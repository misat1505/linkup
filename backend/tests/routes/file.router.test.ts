import path from "path";
import fs from "fs";
import request from "supertest";
import app from "../../src/app";
import { JwtHandler } from "../../src/lib/JwtHandler";
import { VALID_USER_ID } from "../utils/constants";
import { User } from "../../src/types/User";
import { Message } from "../../src/types/Message";

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
  const token = JwtHandler.encode({ userId: VALID_USER_ID });
  let newlyCreatedUserToken: string;

  beforeEach(async () => {
    await createTestUser();
    newlyCreatedUserToken = JwtHandler.encode({ userId: newlyCreatedUser.id });
  });

  afterEach(() => {
    deleteUserFile();
  });

  describe("[GET] /:filename", () => {
    it("should allow everyone to access avatar", async () => {
      const res = await request(app)
        .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
        .set("Cookie", `token=${newlyCreatedUserToken}`);
      expect(res.statusCode).toBe(200);

      const res2 = await request(app)
        .get(`/files/${newlyCreatedUser.photoURL}?filter=avatar`)
        .set("Cookie", `token=${token}`);
      expect(res2.statusCode).toBe(200);
    });

    it("should allow only people in chat see chat photo", async () => {
      const {
        body: { chat },
      } = await request(app)
        .post("/chats/group")
        .set("Cookie", `token=${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("users[1]", "935719fa-05c4-42c4-9b02-2be3fefb6e61")
        .field("name", "chat name")
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      const res = await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Cookie", `token=${token}`);
      expect(res.statusCode).toBe(200);

      const user2Token = JwtHandler.encode({
        userId: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
      });

      const res2 = await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Cookie", `token=${user2Token}`);
      expect(res2.statusCode).toBe(200);

      const res3 = await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Cookie", `token=${newlyCreatedUserToken}`);
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
        .set("Cookie", `token=${token}`)
        .field("users[0]", VALID_USER_ID)
        .field("name", "")
        .field("users[1]", "935719fa-05c4-42c4-9b02-2be3fefb6e61");

      const {
        body: { message },
      } = await request(app)
        .post(`/chats/${chat.id}/messages`)
        .set("Cookie", `token=${token}`)
        .field("content", "message")
        .attach("files", Buffer.from("message file"), "file1.txt");

      const filename = (message as Message).files[0].url;

      const res = await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Cookie", `token=${token}`);
      expect(res.statusCode).toBe(200);

      const user2Token = JwtHandler.encode({
        userId: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
      });

      const res2 = await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Cookie", `token=${user2Token}`);
      expect(res2.statusCode).toBe(200);

      const res3 = await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Cookie", `token=${newlyCreatedUserToken}`);
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
  });
});

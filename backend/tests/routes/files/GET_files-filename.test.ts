import { Application } from "express";
import { User } from "../../../src/types/User";
import { testWithTransaction } from "../../utils/testWithTransaction";
import { TestHelpers } from "../../utils/helpers";
import request from "supertest";
import { TokenProcessor } from "../../../src/lib/TokenProcessor";
import { env } from "../../../src/config/env";
import { Message } from "../../../src/types/Message";
import { v4 as uuidv4 } from "uuid";
import { TEST_FILENAME_PATH } from "../../utils/constants";
import { StatusCodes } from "http-status-codes";

jest.mock("../../../src/lib/FileStorage");

async function createNewUser(app: Application) {
  const login = "valid_login";
  const password = "valid_password";

  const res = await request(app)
    .post("/auth/signup")
    .field("firstName", "Melon")
    .field("lastName", "Muzg")
    .field("login", login)
    .field("password", password)
    .attach("file", TEST_FILENAME_PATH);

  return res.body.user as User;
}

describe("[GET] /files/:filename", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows public access to user avatar", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const createdUser = await createNewUser(app);
      const tokens = TestHelpers.createTokens([
        seed.users[0].id,
        createdUser.id,
      ]);

      await request(app)
        .get(`/files/${createdUser.photoURL}?filter=avatar`)
        .set("Authorization", `Bearer ${tokens[1]}`)
        .expect(StatusCodes.OK);

      await request(app)
        .get(`/files/${createdUser.photoURL}?filter=avatar`)
        .set("Authorization", `Bearer ${tokens[0]}`)
        .expect(StatusCodes.OK);
    });
  });

  it("restricts chat photo access to chat members", async () => {
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
        .attach("file", TEST_FILENAME_PATH);

      await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Authorization", `Bearer ${tokens[0]}`)
        .expect(StatusCodes.OK);

      const user2Token = TokenProcessor.encode(
        {
          userId: seed.users[1].id,
        },
        env.ACCESS_TOKEN_SECRET
      );

      await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .expect(StatusCodes.OK);

      await request(app)
        .get(`/files/${chat.photoURL}?filter=chat-photo&chat=${chat.id}`)
        .set("Authorization", `Bearer ${tokens[1]}`)
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  it("restricts chat message file access to chat members", async () => {
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

      await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Authorization", `Bearer ${tokens[0]}`)
        .expect(StatusCodes.OK);

      const user2Token = TokenProcessor.encode(
        {
          userId: seed.users[1].id,
        },
        env.ACCESS_TOKEN_SECRET
      );

      await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .expect(StatusCodes.OK);

      await request(app)
        .get(`/files/${filename}?filter=chat-message&chat=${chat.id}`)
        .set("Authorization", `Bearer ${tokens[1]}`)
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  it("restricts cache file access to uploader", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res1 = await request(app)
        .post("/files/cache")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("message file"), "file1.txt");
      const newFileName = res1.body.file;

      await request(app)
        .get(`/files/${newFileName}?filter=cache`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);
    });
  });

  it("allows public access to post file", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const createdUser = await createNewUser(app);
      const tokens = TestHelpers.createTokens([
        seed.users[0].id,
        createdUser.id,
      ]);
      const postId = uuidv4();
      const filename = "file.txt";

      await request(app)
        .get(`/files/${filename}?filter=post&post=${postId}`)
        .set("Authorization", `Bearer ${tokens[0]}`)
        .expect(StatusCodes.OK);

      await request(app)
        .get(`/files/${filename}?filter=post&post=${postId}`)
        .set("Authorization", `Bearer ${tokens[1]}`)
        .expect(StatusCodes.OK);
    });
  });
});

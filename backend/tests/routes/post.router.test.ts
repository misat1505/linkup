import request from "supertest";
import { testWithTransaction } from "../utils/testWithTransaction";
import { mockFileStorage } from "../utils/mocks";
import { TestHelpers } from "../utils/helpers";
import { Post } from "../../src/types/Post";

jest.mock("../../src/lib/FileStorage");

describe("posts router", () => {
  describe("[POST] /posts", () => {
    it("should create a new post", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        app.services.fileStorage = mockFileStorage as any;
        const token = TestHelpers.createToken(seed.users[0].id);
        mockFileStorage.listFiles.mockResolvedValue([]);

        const res = await request(app)
          .post("/posts")
          .set("Authorization", `Bearer ${token}`)
          .send({
            content: "This is a new post.",
          });

        expect(res.statusCode).toEqual(201);
        Post.strict().parse(res.body.post);
        expect(res.body.post.content).toBe("This is a new post.");
      });
    });
  });

  describe("[GET] /posts", () => {
    it("should retrieve a list of posts", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const otherUserToken = TestHelpers.createToken(seed.users[1].id);

        const res = await request(app)
          .get("/posts?lastPostId=null&limit=5")
          .set("Authorization", `Bearer ${otherUserToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.posts)).toBe(true);
        expect(res.body.posts.length).toBe(1);
        Post.strict().parse(res.body.posts[0]);
      });
    });
  });

  describe("[GET] /posts/mine", () => {
    it("should retrieve posts by the authenticated user", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        const res = await request(app)
          .get("/posts/mine")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.posts)).toBe(true);
        Post.strict().parse(res.body.posts[0]);
      });
    });
  });

  describe("[GET] /posts/:id", () => {
    it("should retrieve a post by its ID", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);
        const postId = seed.posts[0].id;

        const res = await request(app)
          .get(`/posts/${postId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        Post.strict().parse(res.body.post);
        expect(res.body.post.id).toBe(postId);
      });
    });
  });

  describe("[PUT] /posts/:id", () => {
    it("should update an existing post", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        app.services.fileStorage = mockFileStorage as any;
        const token = TestHelpers.createToken(seed.users[0].id);
        mockFileStorage.listFiles.mockResolvedValue([]);
        const postId = seed.posts[0].id;

        const res = await request(app)
          .put(`/posts/${postId}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            content: "This is the updated content of the post.",
          });

        expect(res.statusCode).toEqual(200);
        Post.strict().parse(res.body.post);
        expect(res.body.post.content).toBe(
          "This is the updated content of the post."
        );
      });
    });
  });

  describe("[DELETE] /posts/:id", () => {
    it("should delete post correctly", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);
        const postId = seed.posts[0].id;

        const res = await request(app)
          .delete(`/posts/${postId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
      });
    });
  });

  describe("[POST] /posts/:id/report", () => {
    it("should report post correctly", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);
        const postId = seed.posts[0].id;

        const res = await request(app)
          .post(`/posts/${postId}/report`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
      });
    });
  });
});

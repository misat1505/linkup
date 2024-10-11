import request from "supertest";
import app from "../../src/app";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { VALID_USER_ID } from "../utils/constants";
import { isPost } from "../../src/types/guards/Post.guard";
import { env } from "../../src/config/env";
import path from "path";
import fs from "fs";

describe("posts router", () => {
  const token = TokenProcessor.encode(
    { userId: VALID_USER_ID },
    env.ACCESS_TOKEN_SECRET
  );

  describe("[POST] /posts", () => {
    it("should create a new post", async () => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a new post.",
        });

      expect(res.statusCode).toEqual(201);
      expect(isPost(res.body.post, { allowStringifiedDates: true })).toBe(true);
      expect(res.body.post.content).toBe("This is a new post.");

      const postFilesPath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "posts",
        res.body.post.id
      );
      expect(fs.existsSync(postFilesPath));
      fs.rmdirSync(postFilesPath, { recursive: true });
    });
  });

  describe("[GET] /posts", () => {
    it("should retrieve a list of posts", async () => {
      const res = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body.posts.length).toBe(1);
      expect(isPost(res.body.posts[0], { allowStringifiedDates: true })).toBe(
        true
      );
    });
  });

  describe("[GET] /posts/mine", () => {
    it("should retrieve posts by the authenticated user", async () => {
      const res = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(isPost(res.body.posts[0], { allowStringifiedDates: true })).toBe(
        true
      );
    });
  });

  describe("[GET] /posts/:id", () => {
    it("should retrieve a post by its ID", async () => {
      const postId = "25776a73-a5c6-40cf-b77f-76288a34cfa7";
      const res = await request(app)
        .get(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(isPost(res.body.post, { allowStringifiedDates: true })).toBe(true);
      expect(res.body.post.id).toBe(postId);
    });
  });

  describe("[PUT] /posts/:id", () => {
    it("should update an existing post", async () => {
      const postId = "25776a73-a5c6-40cf-b77f-76288a34cfa7";
      const res = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is the updated content of the post.",
        });

      expect(res.statusCode).toEqual(200);
      expect(isPost(res.body.post, { allowStringifiedDates: true })).toBe(true);
      expect(res.body.post.content).toBe(
        "This is the updated content of the post."
      );

      const postFilesPath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "posts",
        res.body.post.id
      );
      expect(fs.existsSync(postFilesPath));
      fs.rmdirSync(postFilesPath, { recursive: true });
    });
  });

  describe("[DELETE] /posts/:id", () => {
    it("should delete post correctly", async () => {
      const postId = "25776a73-a5c6-40cf-b77f-76288a34cfa7";
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);

      const postFilesPath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "posts",
        postId
      );
      expect(!fs.existsSync(postFilesPath));
    });
  });
});

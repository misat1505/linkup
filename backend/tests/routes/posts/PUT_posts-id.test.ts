import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

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

  it("shouldn't allow to update a post not belonging to the user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
      const token = TestHelpers.createToken(seed.users[1].id);
      mockFileStorage.listFiles.mockResolvedValue([]);
      const postId = seed.posts[0].id;

      await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is the updated content of the post.",
        })
        .expect(401);
    });
  });
});

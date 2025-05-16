import { StatusCodes } from "http-status-codes";
import { Post } from "@/types/Post";
import { TestHelpers } from "@tests/utils/helpers";
import { mockFileStorage } from "@tests/utils/mocks";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[PUT] /posts/:id", () => {
  it("updates existing post", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      mockFileStorage.listFiles.mockResolvedValue([]);
      const postId = seed.posts[0].id;

      const res = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is the updated content of the post.",
        })
        .expect(StatusCodes.OK);

      Post.strict().parse(res.body.post);
      expect(res.body.post.content).toBe(
        "This is the updated content of the post."
      );
    });
  });

  it("blocks post update by non-owner", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[1].id);
      mockFileStorage.listFiles.mockResolvedValue([]);
      const postId = seed.posts[0].id;

      await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is the updated content of the post.",
        })
        .expect(StatusCodes.FORBIDDEN);
    });
  });
});

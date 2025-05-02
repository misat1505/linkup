import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /posts/:id", () => {
  it("retrieves post by ID", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const postId = seed.posts[0].id;

      const res = await request(app)
        .get(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      Post.strict().parse(res.body.post);
      expect(res.body.post.id).toBe(postId);
    });
  });
});

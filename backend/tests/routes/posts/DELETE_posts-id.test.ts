import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[DELETE] /posts/:id", () => {
  it("should delete post correctly", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const postId = seed.posts[0].id;

      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  it("shouldn't allow to delete a post not belonging to user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[1].id);
      const postId = seed.posts[0].id;

      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
  });
});

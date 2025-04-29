import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

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

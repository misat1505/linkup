import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

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

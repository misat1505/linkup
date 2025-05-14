import { StatusCodes } from "http-status-codes";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /posts/:id/report", () => {
  it("reports post successfully", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const postId = seed.posts[0].id;

      await request(app)
        .post(`/posts/${postId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);
    });
  });

  it("blocks duplicate post report", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const postId = seed.posts[0].id;

      await request(app)
        .post(`/posts/${postId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      await request(app)
        .post(`/posts/${postId}/report`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.CONFLICT);
    });
  });
});

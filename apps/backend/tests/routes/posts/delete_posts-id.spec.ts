import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/test-with-transaction";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, it } from "vitest";

describe("[DELETE] /posts/:id", () => {
  it("deletes post successfully", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const postId = seed.posts[0].id;

      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);
    });
  });

  it("blocks post deletion by non-owner", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[1].id);
      const postId = seed.posts[0].id;

      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.FORBIDDEN);
    });
  });
});

import { Post } from "@packages/schemas";
import { TestHelpers } from "@tests/utils/helpers";
import { mockFileStorage } from "@tests/utils/mocks";
import { testWithTransaction } from "@tests/utils/test-with-transaction";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("[POST] /posts", () => {
  it("creates new post", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      mockFileStorage.listFiles.mockResolvedValue([]);

      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a new post.",
        })
        .expect(StatusCodes.CREATED);

      Post.strict().parse(res.body.post);
      expect(res.body.post.content).toBe("This is a new post.");
    });
  });
});

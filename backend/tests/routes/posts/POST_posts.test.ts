import { StatusCodes } from "http-status-codes";
import { Post } from "@/types/Post";
import { TestHelpers } from "@tests/utils/helpers";
import { mockFileStorage } from "@tests/utils/mocks";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

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

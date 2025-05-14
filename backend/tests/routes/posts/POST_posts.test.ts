import { StatusCodes } from "http-status-codes";
import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
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

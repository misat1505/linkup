import { StatusCodes } from "http-status-codes";
import { Post } from "@/types/Post";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[GET] /posts/mine", () => {
  it("retrieves authenticated user’s posts", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(Array.isArray(res.body.posts)).toBeTruthy();
      Post.strict().parse(res.body.posts[0]);
    });
  });
});

import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /posts/mine", () => {
  it("should retrieve posts by the authenticated user", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      const res = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body.posts)).toBeTruthy();
      Post.strict().parse(res.body.posts[0]);
    });
  });
});

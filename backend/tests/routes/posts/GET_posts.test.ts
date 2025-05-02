import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /posts", () => {
  it("retrieves list of posts", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const otherUserToken = TestHelpers.createToken(seed.users[1].id);

      const res = await request(app)
        .get("/posts?lastPostId=null&limit=5")
        .set("Authorization", `Bearer ${otherUserToken}`)
        .expect(200);

      expect(Array.isArray(res.body.posts)).toBeTruthy();
      expect(res.body.posts.length).toBe(1);
      Post.strict().parse(res.body.posts[0]);
    });
  });

  it("requires lastPostId and limit query parameters", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const otherUserToken = TestHelpers.createToken(seed.users[1].id);

      await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${otherUserToken}`)
        .expect(400);
    });
  });
});

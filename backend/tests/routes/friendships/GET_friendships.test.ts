import { Friendship } from "@/types/Friendship";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[GET] /friendships", () => {
  it("retrieves user friendships", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const tokens = TestHelpers.createTokens([
        seed.users[0].id,
        seed.users[1].id,
      ]);

      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${tokens[0]}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        });

      const res1 = await request(app)
        .get("/friendships")
        .set("Authorization", `Bearer ${tokens[0]}`);

      expect(res1.body.friendships.length).toBe(1);
      res1.body.friendships.forEach((friendship: any) => {
        Friendship.strict().parse(friendship);
      });

      const res2 = await request(app)
        .get("/friendships")
        .set("Authorization", `Bearer ${tokens[1]}`);

      expect(res2.body.friendships.length).toBe(1);
      res2.body.friendships.forEach((friendship: any) => {
        Friendship.strict().parse(friendship);
      });
    });
  });
});

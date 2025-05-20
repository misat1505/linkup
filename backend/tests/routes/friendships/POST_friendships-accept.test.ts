import { StatusCodes } from "http-status-codes";
import { Friendship } from "@/types/Friendship";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
import request from "supertest";

describe("[GET] /friendships/accept", () => {
  it("accepts pending friendship request", async () => {
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
        .post("/friendships/accept")
        .set("Authorization", `Bearer ${tokens[1]}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        });

      Friendship.strict().parse(res1.body.friendship);
    });
  });

  it("blocks accepting own friendship request", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        });

      await request(app)
        .post("/friendships/accept")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

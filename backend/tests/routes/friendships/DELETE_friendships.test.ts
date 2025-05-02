import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[DELETE] /friendships", () => {
  it("deletes existing friendship", async () => {
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

      await request(app)
        .delete("/friendships")
        .set("Authorization", `Bearer ${tokens[1]}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        })
        .expect(200);
    });
  });

  it("blocks deletion of non-owned friendship", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const tokens = TestHelpers.createTokens([
        seed.users[0].id,
        seed.users[2].id,
      ]);

      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${tokens[0]}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        });

      await request(app)
        .delete("/friendships")
        .set("Authorization", `Bearer ${tokens[1]}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        })
        .expect(400);
    });
  });
});

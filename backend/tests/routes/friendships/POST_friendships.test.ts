import { Friendship } from "../../../src/types/Friendship";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /friendships", () => {
  it("creates new friendship request", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const res = await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        })
        .expect(201);

      Friendship.strict().parse(res.body.friendship);
    });
  });

  it("blocks friendship creation by non-requester", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[2].id);
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        })
        .expect(400);
    });
  });

  it("blocks friendship creation with self", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[1].id);
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        })
        .expect(400);
    });
  });
});

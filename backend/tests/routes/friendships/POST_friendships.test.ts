import { StatusCodes } from "http-status-codes";
import { Friendship } from "@/types/Friendship";
import { TestHelpers } from "@tests/utils/helpers";
import { testWithTransaction } from "@tests/utils/testWithTransaction";
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
        .expect(StatusCodes.CREATED);

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
        .expect(StatusCodes.BAD_REQUEST);
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
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});

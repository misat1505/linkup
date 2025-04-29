import { Friendship } from "../../../src/types/Friendship";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("[POST] /friendships", () => {
  it("should create a new friendship", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);
      const res = await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${token}`)
        .send({
          requesterId: seed.users[0].id,
          acceptorId: seed.users[1].id,
        });

      expect(res.statusCode).toEqual(201);
      Friendship.strict().parse(res.body.friendship);
    });
  });
});

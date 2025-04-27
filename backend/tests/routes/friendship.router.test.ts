import { isFriendship } from "../../src/types/guards/friendship.guard";
import request from "supertest";
import { testWithTransaction } from "../utils/testWithTransaction";
import { TestHelpers } from "../utils/helpers";

describe("friendship router", () => {
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
        expect(
          isFriendship(res.body.friendship, { allowStringifiedDates: true })
        ).toBe(true);
      });
    });
  });

  describe("[GET] /friendships", () => {
    it("should return friendships", async () => {
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
          expect(
            isFriendship(friendship, { allowStringifiedDates: true })
          ).toBe(true);
        });

        const res2 = await request(app)
          .get("/friendships")
          .set("Authorization", `Bearer ${tokens[1]}`);

        expect(res2.body.friendships.length).toBe(1);
        res2.body.friendships.forEach((friendship: any) => {
          expect(
            isFriendship(friendship, { allowStringifiedDates: true })
          ).toBe(true);
        });
      });
    });
  });

  describe("[GET] /friendships", () => {
    it("should accept friendship", async () => {
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

        expect(
          isFriendship(res1.body.friendship, {
            allowStringifiedDates: true,
          })
        ).toBe(true);
      });
    });

    it("shouldn't accept own friendship requests", async () => {
      await testWithTransaction(async ({ app, seed }) => {
        const token = TestHelpers.createToken(seed.users[0].id);

        await request(app)
          .post("/friendships")
          .set("Authorization", `Bearer ${token}`)
          .send({
            requesterId: seed.users[0].id,
            acceptorId: seed.users[1].id,
          });

        const res1 = await request(app)
          .post("/friendships/accept")
          .set("Authorization", `Bearer ${token}`);

        expect(res1.statusCode).toBe(400);
      });
    });
  });

  describe("[DELETE] /friendships", () => {
    it("should delete friendship", async () => {
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
          .delete("/friendships")
          .set("Authorization", `Bearer ${tokens[1]}`)
          .send({
            requesterId: seed.users[0].id,
            acceptorId: seed.users[1].id,
          });

        expect(res1.statusCode).toBe(200);
      });
    });
  });
});

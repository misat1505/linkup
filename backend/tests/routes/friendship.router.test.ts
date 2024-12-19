import app from "../../src/app";
import { env } from "../../src/config/env";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { isFriendship } from "../../src/types/guards/friendship.guard";
import { USER } from "../utils/constants";
import request from "supertest";

const user1Token = TokenProcessor.encode(
  { userId: USER.id },
  env.ACCESS_TOKEN_SECRET
);

const user2Id = "935719fa-05c4-42c4-9b02-2be3fefb6e61";

const user2Token = TokenProcessor.encode(
  { userId: user2Id },
  env.ACCESS_TOKEN_SECRET
);

describe("friendship router", () => {
  describe("[POST] /friendships", () => {
    it("should create a new friendship", async () => {
      const res = await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      expect(res.statusCode).toEqual(201);
      expect(
        isFriendship(res.body.friendship, { allowStringifiedDates: true })
      ).toBe(true);
    });
  });

  describe("[GET] /friendships", () => {
    it("should return friendships", async () => {
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      const res1 = await request(app)
        .get("/friendships")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(res1.body.friendships.length).toBe(1);
      res1.body.friendships.forEach((friendship: any) => {
        expect(isFriendship(friendship, { allowStringifiedDates: true })).toBe(
          true
        );
      });

      const res2 = await request(app)
        .get("/friendships")
        .set("Authorization", `Bearer ${user2Token}`);

      expect(res2.body.friendships.length).toBe(1);
      res2.body.friendships.forEach((friendship: any) => {
        expect(isFriendship(friendship, { allowStringifiedDates: true })).toBe(
          true
        );
      });
    });
  });

  describe("[GET] /friendships", () => {
    it("should accept friendship", async () => {
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      const res1 = await request(app)
        .post("/friendships/accept")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      expect(
        isFriendship(res1.body.friendship, {
          allowStringifiedDates: true,
        })
      ).toBe(true);
    });

    it("shouldn't accept own friendship requests", async () => {
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      const res1 = await request(app)
        .post("/friendships/accept")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(res1.statusCode).toBe(400);
    });
  });

  describe("[DELETE] /friendships", () => {
    it("should delete friendship", async () => {
      await request(app)
        .post("/friendships")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      const res1 = await request(app)
        .delete("/friendships")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({
          requesterId: USER.id,
          acceptorId: user2Id,
        });

      expect(res1.statusCode).toBe(200);
    });
  });
});

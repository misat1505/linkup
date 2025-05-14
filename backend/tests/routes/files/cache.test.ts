import { StatusCodes } from "http-status-codes";
import { TestHelpers } from "../../utils/helpers";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

describe("cache routes", () => {
  it("manages file cache operations", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      const token = TestHelpers.createToken(seed.users[0].id);

      await request(app)
        .get("/files/cache")
        .set("Authorization", `Bearer ${token}`);

      const res2 = await request(app)
        .post("/files/cache")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("message file"), "file1.txt");
      const filename1 = res2.body.file;

      await request(app)
        .get(`/files/${filename1}?filter=cache`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      await request(app)
        .delete(`/files/cache/${filename1}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);
    });
  });
});

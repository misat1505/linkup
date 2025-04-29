import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

describe("cache routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles cache correctly", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
      const token = TestHelpers.createToken(seed.users[0].id);

      const res1 = await request(app)
        .get("/files/cache")
        .set("Authorization", `Bearer ${token}`);

      const res2 = await request(app)
        .post("/files/cache")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("message file"), "file1.txt");
      const filename1 = res2.body.file;

      const res3 = await request(app)
        .get(`/files/${filename1}?filter=cache`)
        .set("Authorization", `Bearer ${token}`);
      expect(res3.statusCode).toBe(200);

      const res4 = await request(app)
        .delete(`/files/cache/${filename1}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res4.statusCode).toBe(200);
    });
  });
});

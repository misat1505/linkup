import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

describe("cache routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("manages file cache operations", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
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
        .expect(200);

      await request(app)
        .delete(`/files/cache/${filename1}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

import { Post } from "../../../src/types/Post";
import { TestHelpers } from "../../utils/helpers";
import { mockFileStorage } from "../../utils/mocks";
import { testWithTransaction } from "../../utils/testWithTransaction";
import request from "supertest";

jest.mock("../../../src/lib/FileStorage");

describe("[POST] /posts", () => {
  it("should create a new post", async () => {
    await testWithTransaction(async ({ app, seed }) => {
      app.services.fileStorage = mockFileStorage as any;
      const token = TestHelpers.createToken(seed.users[0].id);
      mockFileStorage.listFiles.mockResolvedValue([]);

      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a new post.",
        })
        .expect(201);

      Post.strict().parse(res.body.post);
      expect(res.body.post.content).toBe("This is a new post.");
    });
  });
});

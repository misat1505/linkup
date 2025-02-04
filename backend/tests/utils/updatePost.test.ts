import fileStorage from "../../src/lib/FileStorage";
import { handleMarkdownUpdate } from "../../src/utils/updatePost";

jest.mock("../../src/lib/FileStorage", () => ({
  copyFile: jest.fn(),
  deleteFile: jest.fn(),
  listFiles: jest
    .fn()
    .mockResolvedValue(["posts/123/file1.png", "posts/123/file2.png"]),
}));

describe("handleMarkdownUpdate", () => {
  const mockUserId = "user-1";
  const mockPostId = "123";

  it("should process markdown, move files, and clean up unused ones", async () => {
    const mockMarkdown = `
      ![image](https://example.com/cache/user-1/file1.png?filter=cache)
      ![another image](https://example.com/cache/user-1/file3.png?filter=cache)
      <img src="https://example.com/cache/user-1/file4.png?filter=cache" />
    `;

    const updatedContent = await handleMarkdownUpdate(
      mockMarkdown,
      mockUserId,
      mockPostId
    );

    expect(fileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file1.png",
      "posts/123/file1.png"
    );
    expect(fileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file3.png",
      "posts/123/file3.png"
    );
    expect(fileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file4.png",
      "posts/123/file4.png"
    );

    expect(fileStorage.deleteFile).toHaveBeenCalledWith("posts/123/file2.png");
    expect(updatedContent).toContain("filter=post&post=123");
  });
});

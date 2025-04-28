import { handleMarkdownUpdate } from "../../src/utils/updatePost";
import { mockFileStorage } from "./mocks";

describe("handleMarkdownUpdate", () => {
  const mockUserId = "user-1";
  const mockPostId = "123";

  it("should process markdown, move files, and clean up unused ones", async () => {
    const mockMarkdown = `
      ![image](https://example.com/cache/user-1/file1.png?filter=cache)
      ![another image](https://example.com/cache/user-1/file3.png?filter=cache)
      <img src="https://example.com/cache/user-1/file4.png?filter=cache" />
    `;
    mockFileStorage.listFiles.mockResolvedValue([
      "posts/123/file1.png",
      "posts/123/file2.png",
    ]);

    const updatedContent = await handleMarkdownUpdate(
      mockFileStorage as any,
      mockMarkdown,
      mockUserId,
      mockPostId
    );

    expect(mockFileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file1.png",
      "posts/123/file1.png"
    );
    expect(mockFileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file3.png",
      "posts/123/file3.png"
    );
    expect(mockFileStorage.copyFile).toHaveBeenCalledWith(
      "cache/user-1/file4.png",
      "posts/123/file4.png"
    );

    expect(mockFileStorage.deleteFile).toHaveBeenCalledWith(
      "posts/123/file2.png"
    );
    expect(updatedContent).toContain("filter=post&post=123");
  });
});

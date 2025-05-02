import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileStorage } from "../../src/lib/FileStorage";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

const mockSend = jest.fn();
(S3Client as jest.Mock).mockImplementation(() => ({
  send: mockSend,
}));

describe("FileStorage", () => {
  let fileStorage: FileStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    fileStorage = new FileStorage({
      region: "us-east-1",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
      bucketName: "test-bucket",
    });
  });

  test("uploads file successfully", async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await fileStorage.uploadFile(
      Buffer.from("test"),
      "text/plain",
      "path/test.txt"
    );

    expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toBe("path/test.txt");
  });

  test("generates signed URL", async () => {
    (getSignedUrl as jest.Mock).mockResolvedValueOnce("https://signed-url");

    const url = await fileStorage.getSignedUrl("path/test.txt");

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(GetObjectCommand),
      { expiresIn: 60 }
    );
    expect(url).toBe("https://signed-url");
  });

  test("lists stored files", async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }],
    });

    const files = await fileStorage.listFiles("folder/");

    expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    expect(files).toEqual(["file1.txt", "file2.txt"]);
  });

  test("returns empty array for no files", async () => {
    mockSend.mockResolvedValueOnce({ Contents: undefined });

    const files = await fileStorage.listFiles("empty-folder/");

    expect(files).toEqual([]);
  });

  test("deletes file successfully", async () => {
    mockSend.mockResolvedValueOnce({});

    await fileStorage.deleteFile("file.txt");

    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  });

  test("copies file successfully", async () => {
    mockSend.mockResolvedValueOnce({});

    await fileStorage.copyFile("source.txt", "destination.txt");

    expect(mockSend).toHaveBeenCalledWith(expect.any(CopyObjectCommand));
  });

  test("deletes all files in directory", async () => {
    mockSend
      .mockResolvedValueOnce({
        Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }],
      })
      .mockResolvedValueOnce({});

    await fileStorage.deleteAllFilesInDirectory("folder/");

    expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
  });

  test("handles empty directory deletion gracefully", async () => {
    mockSend.mockResolvedValueOnce({ Contents: undefined });

    await fileStorage.deleteAllFilesInDirectory("empty-folder/");

    expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    expect(mockSend).not.toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
  });
});

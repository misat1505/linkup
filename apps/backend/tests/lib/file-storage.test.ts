import { FileStorage } from "@/lib/file-storage";
import {
	CopyObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@aws-sdk/client-s3");
vi.mock("@aws-sdk/s3-request-presigner", () => ({
	getSignedUrl: vi.fn(),
}));

const mockSend = vi.fn();
vi.mocked(S3Client).mockImplementation(
	class {
		send = mockSend;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any,
);

describe("FileStorage", () => {
	let fileStorage: FileStorage;

	beforeEach(() => {
		vi.clearAllMocks();
		fileStorage = new FileStorage({
			region: "us-east-1",
			accessKeyId: "test-access-key",
			secretAccessKey: "test-secret-key",
			bucketName: "test-bucket",
		});
	});

	it("uploads file successfully", async () => {
		mockSend.mockResolvedValueOnce({});

		const result = await fileStorage.uploadFile(Buffer.from("test"), "text/plain", "path/test.txt");

		expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
		expect(result).toBe("path/test.txt");
	});

	it("lists stored files", async () => {
		mockSend.mockResolvedValueOnce({
			Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }],
		});

		const files = await fileStorage.listFiles("folder/");

		expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
		expect(files).toEqual(["file1.txt", "file2.txt"]);
	});

	it("returns empty array for no files", async () => {
		mockSend.mockResolvedValueOnce({ Contents: undefined });

		const files = await fileStorage.listFiles("empty-folder/");

		expect(files).toEqual([]);
	});

	it("deletes file successfully", async () => {
		mockSend.mockResolvedValueOnce({});

		await fileStorage.deleteFile("file.txt");

		expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
	});

	it("copies file successfully", async () => {
		mockSend.mockResolvedValueOnce({});

		await fileStorage.copyFile("source.txt", "destination.txt");

		expect(mockSend).toHaveBeenCalledWith(expect.any(CopyObjectCommand));
	});

	it("deletes all files in directory", async () => {
		mockSend
			.mockResolvedValueOnce({
				Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }],
			})
			.mockResolvedValueOnce({});

		await fileStorage.deleteAllFilesInDirectory("folder/");

		expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
		expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
	});

	it("handles empty directory deletion gracefully", async () => {
		mockSend.mockResolvedValueOnce({ Contents: undefined });

		await fileStorage.deleteAllFilesInDirectory("empty-folder/");

		expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
		expect(mockSend).not.toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
	});
});

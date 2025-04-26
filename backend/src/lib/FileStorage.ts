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
import dotenv from "dotenv";
import { env } from "../config/env";

dotenv.config();

/**
 * Class to interact with Amazon S3 for file storage operations.
 *
 * This class provides methods for uploading, retrieving, listing, deleting, and copying files in an S3 bucket.
 * It is designed to be initialized with S3 configuration, either through environment variables or provided parameters.
 *
 * @remarks
 * The class supports interaction with S3 buckets, including generating signed URLs for secure file access, listing files in a directory, and batch deletion of files.
 * It assumes that the necessary AWS credentials and bucket name are provided either explicitly or via environment variables.
 *
 * @class
 * @example
 * const fileStorage = new FileStorage();
 * await fileStorage.uploadFile(fileBuffer, "image/jpeg", "path/to/file.jpg");
 * const url = await fileStorage.getSignedUrl("path/to/file.jpg", 3600);
 *
 * @source
 */
export class FileStorage {
  private s3: S3Client;
  private bucketName: string;

  /**
   * Initializes the FileStorage class with S3 configuration.
   *
   * @param config - Optional configuration object for S3 client.
   * @param config.region - The region for the S3 client (defaults to environment variable).
   * @param config.endpoint - The endpoint for the S3 client (defaults to environment variable).
   * @param config.accessKeyId - The access key ID for AWS credentials (defaults to environment variable).
   * @param config.secretAccessKey - The secret access key for AWS credentials (defaults to environment variable).
   * @param config.bucketName - The S3 bucket name (defaults to environment variable).
   * @param config.forcePathStyle - Whether to force path style URLs (defaults to `true`).
   *
   * @throws {Error} If any required configuration (region, accessKeyId, secretAccessKey, bucketName) is missing.
   */
  constructor(config?: {
    region?: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    forcePathStyle?: boolean;
  }) {
    const isS3Local = env.S3_ENDPOINT.includes("localhost");

    const {
      region = env.AWS_REGION,
      endpoint = isS3Local ? env.S3_ENDPOINT : undefined,
      accessKeyId = env.AWS_ACCESS_KEY_ID,
      secretAccessKey = env.AWS_SECRET_ACCESS_KEY,
      bucketName = env.S3_BUCKET_NAME,
      forcePathStyle = isS3Local,
    } = config || {};

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error(
        "Missing required S3 configuration. Check environment variables or provide them explicitly."
      );
    }

    this.s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
    });

    this.bucketName = bucketName;
  }

  /**
   * Uploads a file to the S3 bucket.
   *
   * @param fileBuffer - The buffer containing the file data.
   * @param contentType - The MIME type of the file (e.g., "image/jpeg").
   * @param path - The path (key) where the file will be stored in the bucket.
   *
   * @returns {Promise<string>} The path (key) where the file is uploaded in S3.
   *
   * @example
   * const filePath = await fileStorage.uploadFile(fileBuffer, "image/jpeg", "uploads/photo.jpg");
   */
  async uploadFile(
    fileBuffer: Buffer,
    contentType: string,
    path: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3.send(command);
    return path;
  }

  /**
   * Generates a signed URL for accessing a file stored in S3.
   *
   * @param path - The path (key) of the file in S3.
   * @param expiresIn - The expiration time for the signed URL in seconds (defaults to 60 seconds).
   *
   * @returns {Promise<string>} A signed URL for accessing the file.
   *
   * @example
   * const url = await fileStorage.getSignedUrl("uploads/photo.jpg", 3600);
   */
  async getSignedUrl(path: string, expiresIn = 60): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn });
    return url;
  }

  /**
   * Lists all files in a specific directory (prefix) in the S3 bucket.
   *
   * @param directory - The directory (prefix) to list files from.
   *
   * @returns {Promise<string[]>} A list of file paths (keys) in the specified directory.
   *
   * @example
   * const files = await fileStorage.listFiles("uploads/");
   */
  async listFiles(directory: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: directory,
    });

    const response = await this.s3.send(command);

    if (!response.Contents) {
      return [];
    }

    return response.Contents.map((item) => item.Key || "").filter(Boolean);
  }

  /**
   * Deletes a file from the S3 bucket.
   *
   * @param path - The path (key) of the file to delete in S3.
   *
   * @example
   * await fileStorage.deleteFile("uploads/photo.jpg");
   */
  async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    await this.s3.send(command);
  }

  /**
   * Copies a file within the S3 bucket.
   *
   * @param sourceKey - The key of the source file to copy.
   * @param destinationKey - The key where the file should be copied to.
   *
   * @example
   * await fileStorage.copyFile("uploads/photo.jpg", "backups/photo.jpg");
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `/${this.bucketName}/${sourceKey}`,
      Key: destinationKey,
    });

    await this.s3.send(command);
  }

  /**
   * Deletes all files within a specific directory (prefix) in the S3 bucket.
   *
   * @param directory - The directory (prefix) to delete all files from.
   *
   * @example
   * await fileStorage.deleteAllFilesInDirectory("uploads/");
   */
  async deleteAllFilesInDirectory(directory: string): Promise<void> {
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: directory,
    });
    const listedObjects = await this.s3.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const objectsToDelete = listedObjects.Contents.map((object) => ({
      Key: object.Key!,
    }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: objectsToDelete,
      },
    });
    await this.s3.send(deleteCommand);
  }
}

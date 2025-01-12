import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

class FileStorage {
  private s3: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor(config?: {
    region?: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    forcePathStyle?: boolean;
  }) {
    const {
      region = process.env.AWS_REGION || "",
      endpoint = process.env.S3_ENDPOINT || "",
      accessKeyId = process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "",
      bucketName = process.env.S3_BUCKET_NAME || "",
      forcePathStyle = true,
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
    this.endpoint = endpoint;
  }

  async uploadFile(
    fileBuffer: Buffer,
    contentType: string,
    path: string
  ): Promise<string | null> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: path,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3.send(command);
      return path;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  async getSignedUrl(path: string, expiresIn = 60): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn });
    return url;
  }

  async listFiles(directory: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: directory,
      });

      const response = await this.s3.send(command);

      if (!response.Contents) {
        return [];
      }

      return response.Contents.map((item) => item.Key || "").filter(Boolean);
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }
}

const fileStorage = new FileStorage();

export default fileStorage;

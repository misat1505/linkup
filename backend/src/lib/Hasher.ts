import { createHash } from "crypto";

export class Hasher {
  static hash(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }
}

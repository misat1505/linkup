import { createHash } from "crypto";

/**
 * A utility class for hashing data using the SHA-256 algorithm.
 *
 * This class provides a static method to generate a SHA-256 hash of a given string.
 * It is designed to be used when you need to securely hash data such as file names, user passwords, or other sensitive information.
 *
 * @remarks
 * The hash is generated using Node.js's built-in `crypto` module, with the output being a 64-character hexadecimal string.
 *
 * @class
 * @example
 * const hashedData = Hasher.hash("some data to hash");
 *
 * @source
 */
export class Hasher {
  static hash(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }
}

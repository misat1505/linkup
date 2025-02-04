import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../types/User";

/**
 * Type representing the payload for JWT tokens.
 *
 * The payload includes the `userId` which represents the unique identifier of the user.
 * This payload is used for both encoding and decoding JWT tokens.
 *
 * @type
 */
export type JwtPayload = { userId: User["id"] };

/**
 * Class for encoding and decoding JWT tokens.
 *
 * @remarks
 * This class provides static methods to generate and validate JWT tokens.
 * It includes methods for encoding data into a JWT token and decoding a JWT token into the original payload.
 *
 * @example
 * const token = TokenProcessor.encode({ userId: 1 }, "secretKey");
 * const payload = TokenProcessor.decode(token, "secretKey");
 *
 * @source
 */
export class TokenProcessor {
  static encode(
    payload: JwtPayload,
    secret: string,
    options?: SignOptions
  ): string {
    return jwt.sign(payload, secret, options);
  }

  static decode(token: string, secret: string): JwtPayload | null {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      return null;
    }
  }
}

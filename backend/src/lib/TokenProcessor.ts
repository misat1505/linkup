import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../types/User";

export type JwtPayload = { userId: User["id"] };

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

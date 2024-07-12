import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = { userId: number };

export class JwtHandler {
  private static readonly secret = env.JWT_SECRET;

  static encode(payload: JwtPayload, options?: SignOptions): string {
    return jwt.sign(payload, this.secret, options);
  }

  static decode(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (err) {
      return null;
    }
  }
}

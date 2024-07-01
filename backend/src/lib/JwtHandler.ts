import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export type JwtPayload = { userId: number };

export class JwtHandler {
  private static readonly secret = JWT_SECRET;

  static encode(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret);
  }

  static decode(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (err) {
      return null;
    }
  }
}

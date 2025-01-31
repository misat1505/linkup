import { CookieOptions } from "express";
import { SignOptions } from "jsonwebtoken";

export const refreshTokenCookieName = "refresh-token";

export const refreshTokenCookieOptions: CookieOptions = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
};

export const refreshTokenSignOptions: SignOptions = {
  expiresIn: "7d",
};

export const accessTokenSignOptions: SignOptions = {
  expiresIn: "15m",
};

import { CookieOptions } from "express";
import { SignOptions } from "jsonwebtoken";

export const refreshTokenCookieName = "token";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
};

export const refreshTokenSignOptions: SignOptions = {
  expiresIn: "7d",
};

export const accessTokenSignOptions: SignOptions = {
  expiresIn: "15m",
};

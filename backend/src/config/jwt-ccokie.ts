import { CookieOptions } from "express";

export const jwtCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000, // 1hr
};

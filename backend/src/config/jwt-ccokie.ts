import { CookieOptions } from "express";

export const jwtCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 60 * 60 * 1000, // 1hr
};

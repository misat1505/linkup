import { CookieOptions } from "express";
import { SignOptions } from "jsonwebtoken";

/**
 * The name of the cookie used for storing the refresh token.
 *
 * @remarks
 * This cookie is used to store the refresh token for the user session.
 */
export const refreshTokenCookieName = "refresh-token";

/**
 * Configuration options for the refresh token cookie.
 *
 * @remarks
 * This configuration ensures that the cookie is securely set with the appropriate flags for security.
 */
export const refreshTokenCookieOptions: CookieOptions = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
};

/**
 * Options for signing the refresh token.
 *
 * @remarks
 * This configuration specifies the expiration time for the refresh token (7 days).
 */
export const refreshTokenSignOptions: SignOptions = {
  expiresIn: "7d",
};

/**
 * Options for signing the access token.
 *
 * @remarks
 * This configuration specifies the expiration time for the access token (15 minutes).
 */
export const accessTokenSignOptions: SignOptions = {
  expiresIn: "15m",
};

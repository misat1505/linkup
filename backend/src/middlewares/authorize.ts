import { NextFunction, Request, Response } from "express";
import { TokenProcessor } from "../lib/TokenProcessor";
import { env } from "../config/env";
import { refreshTokenCookieName } from "../config/jwt-cookie";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to authorize and verify JWT token from Authorization header.
 *
 * This middleware checks for a valid JWT token in the `Authorization` header.
 * If a valid token is found, it decodes the token and appends the decoded payload to `req.user`.
 * If no token is found or if the token is invalid, it responds with an error.
 * After processing, it passes control to the next middleware in the stack.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @example
 * app.use(authorize);
 *
 * @source
 */
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  const userService = req.app.services.userService;

  if (!authorization) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid request - no token" });
  }

  if (!authorization.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid request - token doesn't start with Bearer" });
  }

  const token = authorization.split("Bearer ")[1];

  const tokenPayload = TokenProcessor.decode(token, env.ACCESS_TOKEN_SECRET);
  if (!tokenPayload) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }

  const user = await userService.getUser(tokenPayload.userId);

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid request - user not found." });
  }

  req.user = user;
  next();
};

/**
 * Middleware to authorize and verify JWT token from cookies.
 *
 * This middleware checks for a valid JWT token in cookies (specifically in the refresh token cookie).
 * If the token is valid, it decodes the token and appends the decoded payload to `req.body.token`.
 * If no token is found or if the token is invalid, it responds with an error.
 * After processing, it passes control to the next middleware in the stack.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @example
 * app.use(authorizeWithRefreshToken);
 *
 * @source
 */
export const authorizeWithRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userService = req.app.services.userService;
  const token = req.cookies[refreshTokenCookieName];

  if (!token) {
    return res.status(400).json({ message: "Invalid request - no token" });
  }

  const tokenPayload = TokenProcessor.decode(token, env.REFRESH_TOKEN_SECRET);
  if (!tokenPayload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await userService.getUser(tokenPayload.userId);

  if (!user) {
    return res
      .status(404)
      .json({ message: "Invalid request - user not found." });
  }

  req.user = user;
  next();
};

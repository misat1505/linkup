import { NextFunction, Request, Response } from "express";
import { JwtHandler } from "../lib/JwtHandler";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  /**
   * Middleware to authorize and verify JWT token from cookies.
   *
   * Checks for a valid JWT token in cookies. If valid, appends the decoded token payload
   * to the Request object as req.body.token and passes control to the next function.
   * Terminates the request with an error response if no token is found or if the token is invalid.
   */

  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Invalid request - no token" });
  }

  const tokenPayload = JwtHandler.decode(token);
  if (!tokenPayload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.body.token = tokenPayload;
  next();
};

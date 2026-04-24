import { env } from "@/config/env";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "@/config/jwt-cookie";
import { Hasher } from "@/lib/Hasher";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { processAvatar } from "@/utils/processAvatar";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

/**
 * Controller to sign up a new user, hash the user's password, and return access and refresh tokens.
 *
 * @remarks
 * This controller creates a new user by first validating that the login is not already taken. It hashes the password
 * and processes the avatar if provided. After successfully creating the user, access and refresh tokens are generated
 * and sent in the response, with the refresh token also stored in a cookie.
 *
 * @param {Request} req - The Express request object containing user details and avatar file.
 * @param {Response} res - The Express response object used to return the user data and tokens.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.SIGNUP;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const { body } = extractValidatedRequest(req, API_CONTRACT[contractKey]);
    const { firstName, lastName, login, password } = body;

    const { userService, fileStorage } = req.app.services;
    const file = await processAvatar(fileStorage, req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const isLoginTaken = await userService.isLoginTaken(login);

    if (isLoginTaken) {
      return respond(StatusCodes.CONFLICT, {
        message: req.t("auth.controllers.signup.login-already-exists"),
      });
    }

    const user: UserWithCredentials = {
      id: uuidv4(),
      firstName,
      lastName,
      login,
      password: hashedPassword,
      salt,
      photoURL: file,
      lastActive: new Date(),
    };

    await userService.insertUser(user);

    const refreshToken = TokenProcessor.encode(
      { userId: user.id },
      env.REFRESH_TOKEN_SECRET,
      refreshTokenSignOptions,
    );

    const accessToken = TokenProcessor.encode(
      { userId: user.id },
      env.ACCESS_TOKEN_SECRET,
      accessTokenSignOptions,
    );

    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);

    return respond(StatusCodes.CREATED, {
      user,
      accessToken,
    });
  } catch {
    next(new Error(req.t("auth.controllers.signup.failure")));
  }
};

import { env } from "@/config/env";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "@/config/jwt-cookie";
import { Hasher } from "@/lib/hasher";
import { TokenProcessor } from "@/lib/token-processor";
import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to log in an existing user and generate authentication tokens.
 *
 * @remarks
 * This controller handles the login process for a user by verifying their login credentials.
 * If the login and password match, it generates an access token and a refresh token and returns
 * the access token in the response. The refresh token is set in a secure cookie for further use.
 * If authentication fails, appropriate error responses are returned.
 *
 * @param {Request} req - The Express request object containing the login and password in the body.
 * @param {Response} res - The Express response object used to send the authentication tokens and user data.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @throws {Error} If there is an error during the login process, the next middleware will be called with an error.
 *
 * @source
 */

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.LOGIN;
  const respond = buildValidatedResponder(res, contractKey);
  try {
    const {
      body: { login, password },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);
    const userService = req.app.services.userService;

    const user = await userService.getUserByLogin(login);

    if (!user) {
      return respond(StatusCodes.UNAUTHORIZED, {
        message: req.t("auth.controllers.login.invalid-login"),
      });
    }

    const hashedPassword = Hasher.hash(password + user.salt);
    if (hashedPassword !== user.password) {
      return respond(StatusCodes.UNAUTHORIZED, {
        message: req.t("auth.controllers.login.invalid-password"),
      });
    }

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
    return respond(StatusCodes.OK, { user, accessToken });
  } catch {
    next(new Error(req.t("auth.controllers.login.failure")));
  }
};

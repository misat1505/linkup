import { NextFunction, Request, Response } from "express";
import { UserService } from "../../services/UserService";
import { Hasher } from "../../lib/Hasher";
import { TokenProcessor } from "../../lib/TokenProcessor";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "../../config/jwt-cookie";
import { env } from "../../config/env";

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
 *
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid login or password
 *       500:
 *         description: Cannot log in
 */

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { login, password } = req.body;

    const user = await UserService.getUserByLogin(login);

    if (!user) {
      return res
        .status(401)
        .json({ message: req.t("auth.controllers.login.invalid-login") });
    }

    const hashedPassword = Hasher.hash(password + user.salt);
    if (hashedPassword !== user.password) {
      return res
        .status(401)
        .json({ message: req.t("auth.controllers.login.invalid-password") });
    }

    const refreshToken = TokenProcessor.encode(
      { userId: user.id },
      env.REFRESH_TOKEN_SECRET,
      refreshTokenSignOptions
    );
    const accessToken = TokenProcessor.encode(
      { userId: user.id },
      env.ACCESS_TOKEN_SECRET,
      accessTokenSignOptions
    );
    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);
    return res
      .status(200)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    next(new Error(req.t("auth.controllers.login.login-failed")));
  }
};

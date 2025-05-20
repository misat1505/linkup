import { NextFunction, Request, Response } from "express";
import { processAvatar } from "@/utils/processAvatar";
import { Hasher } from "@/lib/Hasher";
import { User, UserWithCredentials } from "@/types/User";
import { TokenProcessor } from "@/lib/TokenProcessor";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "@/config/jwt-cookie";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/config/env";
import { SignupDTO } from "@/validators/auth/signup.validators";
import { StatusCodes } from "http-status-codes";

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
 *
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Login already taken
 *       500:
 *         description: Cannot create new user
 */
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, login, password } = req.validated!
      .body! as SignupDTO;
    const { userService, fileStorage } = req.app.services;
    const file = await processAvatar(fileStorage, req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const isLoginTaken = await userService.isLoginTaken(login);

    if (isLoginTaken) {
      return res.status(StatusCodes.CONFLICT).json({
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
      refreshTokenSignOptions
    );
    const accessToken = TokenProcessor.encode(
      { userId: user.id },
      env.ACCESS_TOKEN_SECRET,
      accessTokenSignOptions
    );
    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);
    return res
      .status(StatusCodes.CREATED)
      .json({ user: User.parse(user), accessToken });
  } catch (e) {
    console.log(e);
    next(new Error(req.t("auth.controllers.signup.failure")));
  }
};

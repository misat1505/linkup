import { Request, Response } from "express";
import { processAvatar } from "../../utils/processAvatar";
import { Hasher } from "../../lib/Hasher";
import { UserService } from "../../services/UserService";
import { UserWithCredentials } from "../../types/User";
import { TokenProcessor } from "../../lib/TokenProcessor";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "../../config/jwt-cookie";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../config/env";

export const signupController = async (req: Request, res: Response) => {
  /**
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
  try {
    const { firstName, lastName, login, password } = req.body;
    const file = await processAvatar(req.file?.path);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const isLoginTaken = await UserService.isLoginTaken(login);

    if (isLoginTaken) {
      return res.status(409).json({ message: "Login already taken." });
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

    await UserService.insertUser(user);

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
      .status(201)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create new user." });
  }
};

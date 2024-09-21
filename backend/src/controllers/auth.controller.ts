import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { UserWithCredentials } from "../types/User";
import { JwtHandler } from "../lib/JwtHandler";
import { UserService } from "../services/UserService";
import { jwtCookieOptions } from "../config/jwt-cookie";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { processAvatar } from "../utils/processAvatar";
import fs from "fs";
import path from "path";

export const updateUser = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/user:
   *   put:
   *     summary: Update user details
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
   *         description: User updated successfully
   *       409:
   *         description: Login already taken
   *       500:
   *         description: Cannot update user
   */
  try {
    const {
      firstName,
      lastName,
      login,
      password,
      token: { userId },
    } = req.body;
    const file = await processAvatar(req.file?.path);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const fetchedUser = await UserService.getUserByLogin(login);

    if (
      fetchedUser &&
      fetchedUser.login === login &&
      fetchedUser.id !== userId
    ) {
      return res.status(409).json({ message: "Login already taken." });
    }

    const user: UserWithCredentials = {
      id: userId,
      firstName,
      lastName,
      login,
      password: hashedPassword,
      salt,
      photoURL: file,
      lastActive: new Date(),
    };

    await UserService.updateUser(user);

    if (fetchedUser?.photoURL) {
      const oldPath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "avatars",
        fetchedUser.photoURL
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    return res.status(201).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    return res.status(500).json({ message: "Cannot update user." });
  }
};

export const signupUser = async (req: Request, res: Response) => {
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

    const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
    const accessToken = JwtHandler.encode(
      { userId: user.id },
      { expiresIn: "1h" }
    );
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(201)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create new user." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  /**
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
   *       401:
   *         description: Invalid login or password
   *       500:
   *         description: Cannot log in
   */
  try {
    const { login, password } = req.body;

    const user = await UserService.getUserByLogin(login);

    if (!user) {
      return res.status(401).json({ message: "Invalid login." });
    }

    const hashedPassword = Hasher.hash(password + user.salt);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
    const accessToken = JwtHandler.encode(
      { userId: user.id },
      { expiresIn: "1h" }
    );
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot login." });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh access token and refresh token
   *     description: This endpoint reads the refresh token from the request to authorize the user and generate a new access token.
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       500:
   *         description: Cannot refresh token
   */
  try {
    const { userId } = req.body.token;

    const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
    const accessToken = JwtHandler.encode({ userId }, { expiresIn: "1h" });
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ message: "Successfully refreshed token.", accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot refresh token." });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Log out a user
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: User logged out successfully
   *       500:
   *         description: Cannot log out
   */
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot log out." });
  }
};

export const getUser = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/user:
   *   get:
   *     summary: Get current user details
   *     description: This endpoint reads the refresh token from the request to authorize the user and generate a new access token.
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: User fetched successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Cannot fetch user
   */
  try {
    const userId = req.body.token.userId;

    const user = await UserService.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
    const accessToken = JwtHandler.encode(
      { userId: user.id },
      { expiresIn: "1h" }
    );
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch user." });
  }
};

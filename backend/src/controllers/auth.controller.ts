import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { UserWithCredentials } from "../models/User";
import { JwtHandler } from "../lib/JwtHandler";
import { UserService } from "../services/UserService";
import { jwtCookieOptions } from "../config/jwt-cookie";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { processAvatar } from "../lib/processAvatar";

export const signupUser = async (req: Request, res: Response) => {
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
    res.cookie("token", jwt, jwtCookieOptions);
    return res.status(201).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create new user." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
    res.cookie("token", jwt, jwtCookieOptions);
    return res.status(200).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    return res.status(500).json({ message: "Cannot login." });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;

    const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
    res.cookie("token", jwt, jwtCookieOptions);
    return res.status(200).json({ message: "Successfully refreshed token." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot refresh token." });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;

    const logoutJwt = JwtHandler.encode({ userId }, { expiresIn: "0" });
    res.cookie("token", logoutJwt, jwtCookieOptions);
    res.status(200).json({ message: "Successfully logged out." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot log out." });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.token.userId;

    const user = await UserService.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch user." });
  }
};

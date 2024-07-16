import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { User } from "../models/User";
import { JwtHandler } from "../lib/JwtHandler";
import { createFilename } from "../lib/utils/file";
import { UserService } from "../services/UserService";
import { jwtCookieOptions } from "../config/jwt-cookie";
import { v4 as uuidv4 } from "uuid";

export const signupUser = async (req: Request, res: Response) => {
  const { firstName, lastName, login, password } = req.body;
  const file = createFilename(req.file);

  const hashedPassword = Hasher.hash(password);

  const isLoginTaken = await UserService.isLoginTaken(login);

  if (isLoginTaken) {
    return res.status(409).json({ message: "Login already taken." });
  }

  const user: User = {
    id: uuidv4(),
    firstName,
    lastName,
    login,
    password: hashedPassword,
    photoURL: file,
  };

  await UserService.insertUser(user);

  const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
  res.cookie("token", jwt, jwtCookieOptions);
  return res.status(201).json({ user: UserService.intoFrontendUser(user) });
};

export const loginUser = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const hashedPassword = Hasher.hash(password);

  const user = await UserService.loginUser(login, hashedPassword);

  if (!user) {
    return res.status(401).json({ message: "Invalid login or password." });
  }

  const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
  res.cookie("token", jwt, jwtCookieOptions);
  return res.status(200).json({ user: UserService.intoFrontendUser(user) });
};

export const refreshToken = (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
  res.cookie("token", jwt, jwtCookieOptions);
  return res.status(200).json({ message: "Successfully refreshed token." });
};

export const logoutUser = (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const logoutJwt = JwtHandler.encode({ userId }, { expiresIn: "0" });
  res.cookie("token", logoutJwt, jwtCookieOptions);
  res.status(200).json({ message: "Successfully logged out." });
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.body.token.userId;

  const user = await UserService.getUser(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ user: UserService.intoFrontendUser(user) });
};

import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { User } from "../models/User";
import { JwtHandler } from "../lib/JwtHandler";
import { createFilename } from "../lib/utils/file";
import { db } from "../lib/DatabaseConnector";

export const signupUser = async (req: Request, res: Response) => {
  const { firstName, lastName, login, password } = req.body;
  const file = createFilename(req.file);

  const hashedPassword = Hasher.hash(password);

  const isLoginTaken =
    (
      await db.executeQuery("SELECT COUNT(*) FROM Users WHERE login = ?", [
        login,
      ])
    )[0]["COUNT(*)"] > 0;

  if (isLoginTaken) {
    return res.status(409).json({ message: "Login already taken." });
  }

  const result = await db.executeQuery(
    "INSERT INTO Users (login, password, first_name, last_name, photoURL) VALUES (?, ?, ?, ?, ?);",
    [login, hashedPassword, firstName, lastName, file]
  );

  const userId = result.insertId;

  const user: User = {
    id: userId,
    firstName,
    lastName,
    login,
    password: hashedPassword,
    photoURL: file,
  };

  const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
  res.cookie("token", jwt, { httpOnly: true });
  return res.status(201).json({ user });
};

export const loginUser = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  const hashedPassword = Hasher.hash(password);

  const result = await db.executeQuery(
    "SELECT id FROM Users WHERE login = ? AND password = ?;",
    [login, hashedPassword]
  );
  const userData = result[0];

  if (!userData) {
    return res.status(401).json({ message: "Invalid login or password." });
  }

  const jwt = JwtHandler.encode({ userId: userData.id }, { expiresIn: "1h" });
  res.cookie("token", jwt, { httpOnly: true });
  return res.status(200).json({ message: "Successfully logged in." });
};

export const refreshToken = (req: Request, res: Response) => {
  const userId = req.body.token.userId;

  const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
  res.cookie("token", jwt, { httpOnly: true });
  return res.status(200).json({ message: "Successfully refreshed token." });
};

export const logoutUser = (req: Request, res: Response) => {
  const token = req.body.token;

  const logoutJwt = JwtHandler.encode(token, { expiresIn: "0" });
  res.cookie("token", logoutJwt, { httpOnly: true });
  res.status(200).json({ message: "Successfully logged out." });
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.body.token.userId;

  const result = await db.executeQuery("SELECT * FROM Users WHERE id = ?;", [
    userId,
  ]);

  const userData = result[0];
  console.log(userData);

  if (!userData) {
    return res.status(404).json({ message: "User not found." });
  }

  const { first_name: firstName, last_name: lastName, ...rest } = userData;
  const user = { firstName, lastName, ...rest } as User;

  return res.status(200).json({ user });
};

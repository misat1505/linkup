import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { User } from "../models/User";
import { JwtHandler } from "../lib/JwtHandler";
import { createFilename } from "../lib/utils/file";
import { db } from "../lib/DatabaseConnector";

const dummyUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    login: "login1",
    password: Hasher.hash("pass1"),
    photoURL:
      "https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg?lm=1",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    login: "login2",
    password: Hasher.hash("pass2"),
    photoURL:
      "https://img.a.transfermarkt.technology/portrait/big/17121-1672341199.jpg?lm=1",
  },
];

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

export const loginUser = (req: Request, res: Response) => {
  const { login, password } = req.body;

  const hashedPassword = Hasher.hash(password);
  const user = dummyUsers.find(
    (user) => user.login === login && user.password === hashedPassword
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid login or password." });
  }

  const jwt = JwtHandler.encode({ userId: user.id }, { expiresIn: "1h" });
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

export const getUser = (req: Request, res: Response) => {
  const userId = req.body.token.userId;
  const user = dummyUsers.find((usr) => usr.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ user });
};

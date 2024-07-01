import { Request, Response } from "express";
import { Hasher } from "../lib/Hasher";
import { User } from "../models/User";

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

export const loginUser = (req: Request, res: Response) => {
  const { login, password } = req.body;

  const hashedPassword = Hasher.hash(password);
  const user = dummyUsers.find(
    (user) => user.login === login && user.password === hashedPassword
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid login or password" });
  }

  const jwt = "ujhfduyds";
  res.cookie("token", jwt, { httpOnly: true });
  return res.status(200).json({ message: "Successfully logged in" });
};

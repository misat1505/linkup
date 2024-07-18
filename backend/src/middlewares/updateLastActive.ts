import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";

export const updateLastActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.token;

  await UserService.updateLastActive(userId);

  next();
};

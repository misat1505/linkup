import { Hasher } from "@/lib/Hasher";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { processAvatar } from "@/utils/processAvatar";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to update the user's details, including login, password, and avatar.
 *
 * @remarks
 * This controller allows the user to update their personal details, including the first name, last name, login,
 * and password. It also handles avatar updates. If the login is already taken by another user, a conflict response
 * is returned. The old avatar is deleted if a new one is uploaded.
 *
 * @param {Request} req - The Express request object containing the updated user details and avatar file.
 * @param {Response} res - The Express response object used to return the updated user data.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const updateSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.UPDATE_SELF;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const { body } = extractValidatedRequest(req, API_CONTRACT[contractKey]);
    const { firstName, lastName, login, password } = body;

    const userId = req.user!.id;
    const { userService, fileStorage } = req.app.services;

    const file = await processAvatar(fileStorage, req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const fetchedUser = await userService.getUserByLogin(login);

    const isLoginTaken =
      fetchedUser && fetchedUser.login === login && fetchedUser.id !== userId;

    if (isLoginTaken) {
      return respond(StatusCodes.CONFLICT, {
        message: req.t("auth.controllers.update.login-already-exists"),
      });
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

    await userService.updateUser(user);

    if (fetchedUser?.photoURL) {
      await fileStorage.deleteFile(`avatars/${fetchedUser.photoURL}`);
    }

    return respond(StatusCodes.OK, { user });
  } catch {
    next(new Error(req.t("auth.controllers.update.failure")));
  }
};

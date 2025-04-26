import { NextFunction, Request, Response } from "express";
import { processAvatar } from "../../utils/processAvatar";
import { Hasher } from "../../lib/Hasher";
import { UserService } from "../../services/UserService";
import { UserWithCredentials } from "../../types/User";
import bcrypt from "bcryptjs";

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
 *
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
 *         description: Cannot update user
 */
export const updateSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      login,
      password,
      token: { userId },
    } = req.body;
    const { userService, fileStorage } = req.app.services;
    const file = await processAvatar(fileStorage, req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const fetchedUser = await userService.getUserByLogin(login);

    const isLoginTaken =
      fetchedUser && fetchedUser.login === login && fetchedUser.id !== userId;

    if (isLoginTaken) {
      return res.status(409).json({
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

    return res.status(201).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    next(new Error(req.t("auth.controllers.update.failure")));
  }
};

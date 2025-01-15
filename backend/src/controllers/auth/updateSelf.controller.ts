import { NextFunction, Request, Response } from "express";
import { processAvatar } from "../../utils/processAvatar";
import { Hasher } from "../../lib/Hasher";
import { UserService } from "../../services/UserService";
import { UserWithCredentials } from "../../types/User";
import bcrypt from "bcryptjs";
import fileStorage from "../../lib/FileStorage";

export const updateSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  try {
    const {
      firstName,
      lastName,
      login,
      password,
      token: { userId },
    } = req.body;
    const file = await processAvatar(req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = Hasher.hash(password + salt);

    const fetchedUser = await UserService.getUserByLogin(login);

    const isLoginTaken =
      fetchedUser && fetchedUser.login === login && fetchedUser.id !== userId;

    if (isLoginTaken) {
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
      await fileStorage.deleteFile(`avatars/${fetchedUser.photoURL}`);
    }

    return res.status(201).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    next(new Error("Cannot update user."));
  }
};

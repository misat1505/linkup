import { NextFunction, Request, Response } from "express";
import { UserService } from "../../services/UserService";

/**
 * Controller to fetch the details of the currently authenticated user.
 *
 * @remarks
 * This controller retrieves the details of the user who is currently authenticated
 * based on the user ID in the request token. If the user is found, it returns the
 * user data without sensitive information (like credentials). If the user is not found,
 * it returns a 404 status code.
 *
 * @param {Request} req - The Express request object containing the user's token.
 * @param {Response} res - The Express response object used to send the user data or error.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @throws {Error} If there is an error fetching the user, the next middleware will be called with an error.
 *
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Cannot fetch user
 */
export const getSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userService = req.app.services.userService;

    const user = await userService.getUser(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: req.t("auth.controllers.get-self.user-not-found") });
    }

    return res.status(200).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    next(new Error(req.t("auth.controllers.get-self.failure")));
  }
};

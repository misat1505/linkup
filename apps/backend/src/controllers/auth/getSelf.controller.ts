import { CONTRACT_KEYS, extractResponseSchema } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
 */
export const getSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.GET_SELF;
  try {
    const userId = req.user!.id;
    const userService = req.app.services.userService;

    const user = await userService.getUser(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("auth.controllers.get-self.user-not-found") });
    }

    const schema = extractResponseSchema(contractKey, StatusCodes.OK);
    return res.status(StatusCodes.OK).json(schema.parse({ user }));
  } catch {
    next(new Error(req.t("auth.controllers.get-self.failure")));
  }
};

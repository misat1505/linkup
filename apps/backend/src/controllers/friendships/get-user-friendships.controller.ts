import { buildValidatedResponder } from "@/utils/validated-responder";
import { CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve a list of user friendships.
 *
 * @remarks
 * This controller handles fetching all friendships for a given user. It retrieves the user ID from the request token and queries the FriendshipService for a list of friendships associated with that user. If successful, it returns the list of friendships. If there's a server error, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the user token.
 * @param {Response} res - The Express response object used to send the list of friendships or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getUserFriendships = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.GET_USER_FRIENDSHIPS;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const userId = req.user!.id;
    const friendshipService = req.app.services.friendshipService;

    const friendships = await friendshipService.getUserFriendships(userId);

    return respond(StatusCodes.OK, {
      friendships,
    });
  } catch {
    next(new Error(req.t("friends.controllers.get.failure")));
  }
};

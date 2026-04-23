import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to delete an existing friendship between two users.
 *
 * @remarks
 * This controller handles the deletion of a friendship between two users. It first validates that the user requesting the deletion is either the requester or the acceptor of the friendship. It then attempts to delete the friendship. If successful, it returns a success message. If the friendship doesn't exist or the user is not authorized to delete it, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const deleteFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      body: { acceptorId, requesterId },
    } = extractValidatedRequest(req, API_CONTRACT.DELETE_FRIENDSHIP);
    const userId = req.user!.id;
    const friendshipService = req.app.services.friendshipService;

    if (![requesterId, acceptorId].includes(userId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: req.t("friends.controllers.delete.unauthorized") });

    const isDeleted = await friendshipService.deleteFriendship(
      requesterId,
      acceptorId,
    );

    if (!isDeleted)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("friends.controllers.delete.not-found") });

    return res
      .status(StatusCodes.OK)
      .json({ message: req.t("friends.controllers.delete.success") });
  } catch {
    next(new Error(req.t("friends.controllers.delete.failure")));
  }
};

import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to accept an existing friendship request.
 *
 * @remarks
 * This controller handles the logic of accepting a pending friendship request. It validates that the user making the request is the one intended to accept the friendship, checks if the friendship exists, and updates the friendship status accordingly. If successful, it returns the updated friendship object; otherwise, it returns an error message depending on the issue (e.g., invalid user, non-existing friendship).
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const acceptFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      body: { acceptorId, requesterId },
    } = extractValidatedRequest(req, API_CONTRACT.ACCEPT_FRIENDSHIP);
    const userId = req.user!.id;
    const friendshipService = req.app.services.friendshipService;

    if (userId !== acceptorId)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: req.t("friends.controllers.accept.unauthorized"),
      });

    const friendship = await friendshipService.acceptFriendship(
      requesterId,
      acceptorId,
    );

    if (!friendship)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: req.t("friends.controllers.accept.not-found") });

    return res.status(StatusCodes.OK).json({ friendship });
  } catch {
    next(new Error(req.t("friends.controllers.accept.failure")));
  }
};

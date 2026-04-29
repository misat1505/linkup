import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to create a new friendship request between two users.
 *
 * @remarks
 * This controller handles the creation of a friendship between two users. It validates that the user making the request is the one initiating the friendship, checks if the friendship already exists, and creates the friendship if possible. If successful, it returns the newly created friendship object; otherwise, it returns an error message depending on the issue (e.g., user mismatch, existing friendship).
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const createFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.CREATE_FRIENDSHIP;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      body: { acceptorId, requesterId },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const friendshipService = req.app.services.friendshipService;

    if (userId !== requesterId) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t("friends.controllers.create.unauthorized"),
      });
    }

    const friendship = await friendshipService.createFriendship(
      requesterId,
      acceptorId,
    );

    if (!friendship) {
      return respond(StatusCodes.CONFLICT, {
        message: req.t("friends.controllers.create.already-exists"),
      });
    }

    return respond(StatusCodes.CREATED, {
      friendship,
    });
  } catch {
    next(new Error(req.t("friends.controllers.create.failure")));
  }
};

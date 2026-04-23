import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to report a post by an authenticated user.
 *
 * @remarks
 * This controller allows a user to report a post by its ID. It uses the `PostService` to create a report entry
 * linking the user to the reported post. If the user has already reported the post, a unique constraint error (P2002)
 * is caught and an appropriate message is returned. All other errors are treated as general failures.
 *
 * @param {Request} req - The Express request object, containing the post ID in the URL parameters and user ID in the token payload.
 * @param {Response} res - The Express response object, used to return a success message if the report is created.
 * @param {NextFunction} next - The Express next function used for error handling and forwarding localized error messages.
 *
 * @source
 */
export const reportPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT.REPORT_POST);
    const userId = req.user!.id;
    const postService = req.app.services.postService;

    await postService.reportPost(userId, id);

    res
      .status(StatusCodes.OK)
      .json({ message: req.t("posts.controllers.report.success") });
  } catch (e) {
    const violatedUniqueConstraint =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

    if (violatedUniqueConstraint) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: req.t("posts.controllers.report.already-reported") });
      return;
    }

    next(new Error(req.t("posts.controllers.report.failure")));
  }
};

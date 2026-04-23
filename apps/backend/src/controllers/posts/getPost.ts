import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve a post by its ID.
 *
 * @remarks
 * This controller handles the retrieval of a post by its ID. It checks whether the post exists, and if found, returns the post data. If the post is not found, a 404 error is returned. In case of a server error, a 500 error is sent with an appropriate message.
 *
 * @param {Request} req - The Express request object containing the post ID from the path.
 * @param {Response} res - The Express response object used to send the retrieved post data or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT.GET_POST);
    const postService = req.app.services.postService;

    const post = await postService.getPost(id);

    if (!post)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("posts.controllers.get-single.not-found") });

    return res.status(StatusCodes.OK).json({ post });
  } catch {
    next(new Error(req.t("posts.controllers.get-single.failure")));
  }
};

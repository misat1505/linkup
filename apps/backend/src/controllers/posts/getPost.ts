import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
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
  const contractKey = CONTRACT_KEYS.GET_POST;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const postService = req.app.services.postService;

    const post = await postService.getPost(id);

    if (!post) {
      return respond(StatusCodes.NOT_FOUND, {
        message: req.t("posts.controllers.get-single.not-found"),
      });
    }

    return respond(StatusCodes.OK, { post });
  } catch {
    next(new Error(req.t("posts.controllers.get-single.failure")));
  }
};

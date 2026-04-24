import { buildValidatedResponder } from "@/utils/validatedResponder";
import { CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve posts by the authenticated user.
 *
 * @remarks
 * This controller handles the retrieval of posts specifically created by the authenticated user. It fetches the user's posts from the service layer using the user ID extracted from the authentication token.
 * In case of an error (such as a server failure), a 500 error is returned with an appropriate message.
 *
 * @param {Request} req - The Express request object, which contains the authentication token in the request body to identify the user.
 * @param {Response} res - The Express response object, used to send the retrieved posts or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.GET_USER_POSTS;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const userId = req.user!.id;
    const postService = req.app.services.postService;

    const posts = await postService.getUserPosts(userId);

    return respond(StatusCodes.OK, { posts });
  } catch {
    next(new Error(req.t("posts.controllers.get-users.failure")));
  }
};

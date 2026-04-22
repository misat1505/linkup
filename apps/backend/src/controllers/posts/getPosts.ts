import { GetPostsQuery } from "@/validators/posts/posts.validators";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve a list of posts.
 *
 * @remarks
 * This controller handles the retrieval of a list of posts. It fetches all the posts from the service layer and returns them. In case of a server error, a 500 error is returned with an appropriate message.
 *
 * @param {Request} req - The Express request object, used to handle any incoming request data.
 * @param {Response} res - The Express response object used to send the list of posts or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { lastPostId, limit } = req.validated!.query! as GetPostsQuery;
    const postRecommendationService =
      req.app.services.postRecommendationService;

    const posts = await postRecommendationService.getRecommendedPosts(
      userId,
      lastPostId,
      limit,
    );

    return res.status(StatusCodes.OK).json({ posts });
  } catch {
    next(new Error(req.t("posts.controllers.get-all.failure")));
  }
};

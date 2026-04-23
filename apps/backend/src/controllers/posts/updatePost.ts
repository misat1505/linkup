import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { handleMarkdownUpdate } from "@/utils/updatePost";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to update an existing post by its ID.
 *
 * @remarks
 * This controller handles the update of a post's content. The ID of the post is extracted from the request parameters, and the new content is obtained from the request body.
 * Before updating, it checks whether the post exists and if the authenticated user is the author of the post.
 * If any conditions are violated, appropriate error responses are returned.
 * If the post is updated successfully, the updated post is returned.
 *
 * @param {Request} req - The Express request object, which contains the post ID in the URL parameters and the updated content in the request body.
 * @param {Response} res - The Express response object, used to send the updated post or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      body: { content },
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT.UPDATE_POST);
    const userId = req.user!.id;
    const { postService, fileStorage } = req.app.services;

    const post = await postService.getPost(id);

    if (!post)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("posts.controllers.update.not-found") });

    if (post.author.id !== userId)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: req.t("posts.controllers.update.unauthorized") });

    const updatedContent = await handleMarkdownUpdate(
      fileStorage,
      content,
      userId,
      id,
    );

    const newPost = await postService.updatePost({
      id,
      content: updatedContent,
    });

    return res.status(StatusCodes.OK).json({ post: newPost });
  } catch {
    next(new Error(req.t("posts.controllers.update.failure")));
  }
};

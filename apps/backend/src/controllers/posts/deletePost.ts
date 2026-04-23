import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to delete a post.
 *
 * @remarks
 * This controller handles the deletion of a post by checking if the post exists and whether the user requesting the deletion is the post's author. If the post exists and the user is authorized, the post is deleted, along with associated files from file storage. If the post is not found or the user is not authorized, appropriate error messages are returned.
 *
 * @param {Request} req - The Express request object containing the post ID from the path and the user token.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT.DELETE_POST);
    const userId = req.user!.id;
    const { postService, fileStorage } = req.app.services;

    const post = await postService.getPost(id);

    if (!post)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("posts.controllers.delete.not-found") });

    if (post.author.id !== userId)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: req.t("posts.controllers.delete.unauthorized") });

    await Promise.all([
      postService.deletePost(id),
      fileStorage.deleteAllFilesInDirectory(`posts/${post.id}`),
      fileStorage.deleteAllFilesInDirectory(`chats/${post.chat.id}`),
    ]);

    return res
      .status(StatusCodes.OK)
      .json({ message: req.t("posts.controllers.delete.success") });
  } catch {
    next(new Error(req.t("posts.controllers.delete.failure")));
  }
};

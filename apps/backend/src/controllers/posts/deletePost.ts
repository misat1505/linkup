import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
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
  const contractKey = CONTRACT_KEYS.DELETE_POST;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      params: { id },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const { postService, fileStorage } = req.app.services;

    const post = await postService.getPost(id);

    if (!post) {
      return respond(StatusCodes.NOT_FOUND, {
        message: req.t("posts.controllers.delete.not-found"),
      });
    }

    if (post.author.id !== userId) {
      return respond(StatusCodes.FORBIDDEN, {
        message: req.t("posts.controllers.delete.unauthorized"),
      });
    }

    await Promise.all([
      postService.deletePost(id),
      fileStorage.deleteAllFilesInDirectory(`posts/${post.id}`),
      fileStorage.deleteAllFilesInDirectory(`chats/${post.chat.id}`),
    ]);

    return respond(StatusCodes.OK, {
      message: req.t("posts.controllers.delete.success"),
    });
  } catch {
    next(new Error(req.t("posts.controllers.delete.failure")));
  }
};

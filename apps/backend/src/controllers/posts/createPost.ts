import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { handleMarkdownUpdate } from "@/utils/updatePost";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

/**
 * Controller to create a new post.
 *
 * @remarks
 * This controller handles creating a new post by receiving content and the user ID from the request. It generates a unique ID for the new post and processes the content (e.g., Markdown). After the content is updated, it creates the post through the `PostService`. If successful, it returns the newly created post. If there's a server error, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the post content and the user token.
 * @param {Response} res - The Express response object used to send the created post or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.CREATE_POST;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      body: { content },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const { postService, fileStorage } = req.app.services;

    const id = uuidv4();

    const updatedContent = await handleMarkdownUpdate(
      fileStorage,
      content,
      userId,
      id,
    );

    const post = await postService.createPost({
      id,
      content: updatedContent,
      authorId: userId,
    });

    return respond(StatusCodes.CREATED, { post });
  } catch {
    next(new Error(req.t("posts.controllers.create.failure")));
  }
};

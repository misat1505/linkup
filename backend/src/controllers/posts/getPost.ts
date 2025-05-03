import { NextFunction, Request, Response } from "express";
import { PostId } from "../../validators/shared.validators";

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
 *
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: string
 *           example: "d0683f62-4c30-4eef-9578-7eac5c814c47"
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error, could not retrieve post
 */
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.validated!.params! as PostId;
    const postService = req.app.services.postService;

    const post = await postService.getPost(id);

    if (!post)
      return res
        .status(404)
        .json({ message: req.t("posts.controllers.get-single.not-found") });

    return res.status(200).json({ post });
  } catch (e) {
    next(new Error(req.t("posts.controllers.get-single.failure")));
  }
};

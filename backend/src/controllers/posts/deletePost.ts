import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";
import fileStorage from "../../lib/FileStorage";

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
 *
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *           example: "12a627e8-83cb-40c9-a7a2-ca0708be7763"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully."
 *       401:
 *         description: Unauthorized access. The user is not allowed to delete this post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Couldn't delete the post.
 */
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      token: { userId },
    } = req.body;

    const post = await PostService.getPost(id);

    if (!post)
      return res
        .status(404)
        .json({ message: req.t("posts.controllers.delete.not-found") });

    if (post.author.id !== userId)
      return res
        .status(401)
        .json({ message: req.t("posts.controllers.delete.unauthorized") });

    await Promise.all([
      PostService.deletePost(id),
      fileStorage.deleteAllFilesInDirectory(`posts/${post.id}`),
      fileStorage.deleteAllFilesInDirectory(`chats/${post.chat.id}`),
    ]);

    return res
      .status(200)
      .json({ message: req.t("posts.controllers.delete.success") });
  } catch (e) {
    next(new Error(req.t("posts.controllers.delete.failure")));
  }
};

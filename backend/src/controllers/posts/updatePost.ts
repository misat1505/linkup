import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";
import { handleMarkdownUpdate } from "../../utils/updatePost";

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
 *
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update an existing post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *                 example: "This is the updated content of the post."
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized, user cannot edit this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error, couldn't update post
 */
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      token: { userId },
      content,
    } = req.body;

    const post = await PostService.getPost(id);

    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.author.id !== userId)
      return res
        .status(401)
        .json({ message: "Cannot edit post not belonging to you." });

    const updatedContent = await handleMarkdownUpdate(content, userId, id);

    const newPost = await PostService.updatePost({
      id,
      content: updatedContent,
    });

    return res.status(200).json({ post: newPost });
  } catch (e) {
    next(new Error("Couldn't get post."));
  }
};

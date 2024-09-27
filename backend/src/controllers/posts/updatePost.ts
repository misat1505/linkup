import { Request, Response } from "express";
import { PostService } from "../../services/PostService";
import { handleMarkdownUpdate } from "../../utils/updatePost";

export const updatePost = async (req: Request, res: Response) => {
  /**
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

    const updatedContent = handleMarkdownUpdate(content, userId, id);

    const newPost = await PostService.updatePost({
      id,
      content: updatedContent,
    });

    return res.status(200).json({ post: newPost });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get post." });
  }
};

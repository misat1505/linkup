import { Request, Response } from "express";
import { PostService } from "../../services/PostService";
import fileStorage from "../../lib/FileStorage";

export const deletePost = async (req: Request, res: Response) => {
  /**
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
   *         description: Server error. Couldn't delete the post.
   */
  try {
    const { id } = req.params;
    const {
      token: { userId },
    } = req.body;

    const post = await PostService.getPost(id);

    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.author.id !== userId)
      return res
        .status(401)
        .json({ message: "Cannot delete post not belonging to you." });

    await Promise.all([
      PostService.deletePost(id),
      fileStorage.deleteAllFilesInDirectory(`posts/${post.id}`),
      fileStorage.deleteAllFilesInDirectory(`chats/${post.chat.id}`),
    ]);

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't delete post." });
  }
};

import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getPost = async (req: Request, res: Response) => {
  /**
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
  try {
    const { id } = req.params;

    const post = await PostService.getPost(id);

    return res.status(200).json({ post });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get post." });
  }
};

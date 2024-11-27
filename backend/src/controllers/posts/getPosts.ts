import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getPosts = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: Retrieve a list of posts
   *     tags: [Posts]
   *     responses:
   *       200:
   *         description: A list of posts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 posts:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Post'
   *       500:
   *         description: Server error, could not retrieve posts
   */
  try {
    const posts = await PostService.getPosts();

    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get posts." });
  }
};

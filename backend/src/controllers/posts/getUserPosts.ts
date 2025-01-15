import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @swagger
   * /posts/mine:
   *   get:
   *     summary: Retrieve posts by the authenticated user
   *     tags: [Posts]
   *     responses:
   *       200:
   *         description: User's posts retrieved successfully
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
   *         description: Server error, couldn't retrieve user posts
   */
  try {
    const {
      token: { userId },
    } = req.body;

    const posts = await PostService.getUserPosts(userId);

    return res.status(200).json({ posts });
  } catch (e) {
    next(new Error("Couldn't get user posts."));
  }
};

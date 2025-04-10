import { NextFunction, Request, Response } from "express";
import { Post } from "../../types/Post";
import { PostRecommendationService } from "../../services/PostRecommendationService";

/**
 * Controller to retrieve a list of posts.
 *
 * @remarks
 * This controller handles the retrieval of a list of posts. It fetches all the posts from the service layer and returns them. In case of a server error, a 500 error is returned with an appropriate message.
 *
 * @param {Request} req - The Express request object, used to handle any incoming request data.
 * @param {Response} res - The Express response object used to send the list of posts or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     parameters:
 *       - name: lastPostId
 *         in: query
 *         description: The ID of the last post, used for pagination.
 *         required: false
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: The number of posts to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 10
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
 *       400:
 *         description: Invalid query parameter (e.g., limit exceeds 10)
 *       500:
 *         description: Server error, could not retrieve posts
 */
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const { lastPostId: queryLastPostId, limit: queryLimit } = req.query;

    const limit = processLimit(queryLimit);

    if (limit > 10) {
      res.status(400).json({ message: `Maximum limit is 10 - given ${limit}` });
    }

    const posts = await PostRecommendationService.getRecommendedPosts(
      userId,
      processLastPostId(queryLastPostId),
      limit
    );

    return res.status(200).json({ posts });
  } catch (e) {
    next(new Error(req.t("posts.controllers.get-all.failure")));
  }
};

const processLimit = (queryLimit: unknown): number => {
  const defaultLimit = 10;
  if (!queryLimit || typeof queryLimit !== "string") return defaultLimit;
  const parsed = parseInt(queryLimit);
  if (isNaN(parsed)) return 10;
  return parsed;
};

const processLastPostId = (queryLastPostId: unknown): Post["id"] | null => {
  if (!queryLastPostId || typeof queryLastPostId !== "string") return null;
  if (queryLastPostId === "null") return null;
  return queryLastPostId;
};

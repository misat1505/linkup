import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";

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
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await PostService.getPosts();

    return res.status(200).json({ posts });
  } catch (e) {
    next(new Error("Couldn't get posts."));
  }
};

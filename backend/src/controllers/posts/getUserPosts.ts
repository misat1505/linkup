import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";

/**
 * Controller to retrieve posts by the authenticated user.
 *
 * @remarks
 * This controller handles the retrieval of posts specifically created by the authenticated user. It fetches the user's posts from the service layer using the user ID extracted from the authentication token.
 * In case of an error (such as a server failure), a 500 error is returned with an appropriate message.
 *
 * @param {Request} req - The Express request object, which contains the authentication token in the request body to identify the user.
 * @param {Response} res - The Express response object, used to send the retrieved posts or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      token: { userId },
    } = req.body;

    const posts = await PostService.getUserPosts(userId);

    return res.status(200).json({ posts });
  } catch (e) {
    next(new Error(req.t("posts.controllers.get-users.failure")));
  }
};

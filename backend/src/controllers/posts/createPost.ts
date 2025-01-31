import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";
import { v4 as uuidv4 } from "uuid";
import { handleMarkdownUpdate } from "../../utils/updatePost";

/**
 * Controller to create a new post.
 *
 * @remarks
 * This controller handles creating a new post by receiving content and the user ID from the request. It generates a unique ID for the new post and processes the content (e.g., Markdown). After the content is updated, it creates the post through the `PostService`. If successful, it returns the newly created post. If there's a server error, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the post content and the user token.
 * @param {Response} res - The Express response object used to send the created post or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: "This is a new post."
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error, could not create post
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      content,
      token: { userId },
    } = req.body;

    const id = uuidv4();

    const updatedContent = await handleMarkdownUpdate(content, userId, id);

    const post = await PostService.createPost({
      id,
      content: updatedContent,
      authorId: userId,
    });

    return res.status(201).json({ post });
  } catch (e) {
    next(new Error("Couldn't create post."));
  }
};

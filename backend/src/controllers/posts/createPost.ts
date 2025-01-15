import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";
import { v4 as uuidv4 } from "uuid";
import { handleMarkdownUpdate } from "../../utils/updatePost";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
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

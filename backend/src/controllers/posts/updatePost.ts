import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const updatePost = async (req: Request, res: Response) => {
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

    const newPost = await PostService.updatePost({ id, content });

    return res.status(200).json({ post: newPost });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get post." });
  }
};

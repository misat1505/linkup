import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      content,
      token: { userId },
    } = req.body;

    const post = await PostService.createPost({
      content,
      authorId: userId,
      files: [],
    });

    return res.status(201).json({ post });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't create post." });
  }
};

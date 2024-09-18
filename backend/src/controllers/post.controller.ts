import { Request, Response } from "express";
import { PostService } from "../services/PostService";

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const {
      token: { userId },
    } = req.body;

    const posts = await PostService.getUserPosts(userId);

    return res.status(201).json({ posts });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get user posts." });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostService.getPosts();

    return res.status(201).json({ posts });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get posts." });
  }
};

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

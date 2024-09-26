import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostService.getPosts();

    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get posts." });
  }
};

import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const {
      token: { userId },
    } = req.body;

    const posts = await PostService.getUserPosts(userId);

    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get user posts." });
  }
};
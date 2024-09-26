import { Request, Response } from "express";
import { PostService } from "../../services/PostService";

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await PostService.getPost(id);

    return res.status(200).json({ post });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't get post." });
  }
};

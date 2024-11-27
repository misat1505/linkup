import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const getUserFriendships = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;

    const friendships = await FriendshipService.getUserFriendships(userId);

    return res.status(200).json({ friendships });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};

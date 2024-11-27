import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const createFriendship = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;

    if (userId !== requesterId)
      return res
        .status(400)
        .json({ message: "Cannot create friendship not requested by you." });

    const friendship = await FriendshipService.createFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: "Friendship already exists between users." });

    return res.status(200).json({ friendship });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};

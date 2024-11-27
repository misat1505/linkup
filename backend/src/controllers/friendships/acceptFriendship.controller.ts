import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const acceptFriendship = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;
    console.log(userId, requesterId, acceptorId);

    if (userId !== acceptorId)
      return res.status(400).json({
        message:
          "Cannot accept friendship not being meant to be accepted by you.",
      });

    const friendship = await FriendshipService.acceptFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: "Friendship between users doesn't exist." });

    return res.status(200).json({ friendship });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};

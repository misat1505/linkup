import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const deleteFriendship = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;

    if (![requesterId, acceptorId].includes(userId))
      return res
        .status(400)
        .json({ message: "Cannot delete friendship not belonging to you." });

    const isDeleted = await FriendshipService.deleteFriendship(
      requesterId,
      acceptorId
    );

    if (!isDeleted)
      return res.status(404).json({ message: "Friendship not found." });

    return res
      .status(200)
      .json({ message: "Friendship deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};

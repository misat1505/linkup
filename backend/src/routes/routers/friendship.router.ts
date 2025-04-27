import { Router } from "express";
import { FriendshipControllers } from "../../controllers";

/**
 * Friendship Routes Router.
 *
 * This router handles operations related to user friendships, including viewing,
 * creating, accepting, and deleting friendships.
 */
const friendshipRouter = Router();

friendshipRouter.get("/", FriendshipControllers.getUserFriendships);
friendshipRouter.post("/accept", FriendshipControllers.acceptFriendship);
friendshipRouter.post("/", FriendshipControllers.createFriendship);
friendshipRouter.delete("/", FriendshipControllers.deleteFriendship);

export default friendshipRouter;

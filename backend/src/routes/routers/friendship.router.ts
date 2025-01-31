import { Router } from "express";
import { getUserFriendships } from "../../controllers/friendships/getUserFriendships.controller";
import { createFriendship } from "../../controllers/friendships/createFriendship.controller";
import { acceptFriendship } from "../../controllers/friendships/acceptFriendship.controller";
import { deleteFriendship } from "../../controllers/friendships/deleteFriendship.controller";

/**
 * Friendship Routes Router.
 *
 * This router handles operations related to user friendships, including viewing,
 * creating, accepting, and deleting friendships.
 */
const friendshipRouter = Router();

friendshipRouter.get("/", getUserFriendships);
friendshipRouter.post("/accept", acceptFriendship);
friendshipRouter.post("/", createFriendship);
friendshipRouter.delete("/", deleteFriendship);

export default friendshipRouter;

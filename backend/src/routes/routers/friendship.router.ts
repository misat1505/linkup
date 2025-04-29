import { Router } from "express";
import { FriendshipControllers } from "../../controllers";
import { zodValidate } from "../../middlewares/validate";
import {
  AcceptFriendshipDTO,
  CreateFriendshipDTO,
  DeleteFriendshipDTO,
} from "../../validators/friendships/friendships.validators";

/**
 * Friendship Routes Router.
 *
 * This router handles operations related to user friendships, including viewing,
 * creating, accepting, and deleting friendships.
 */
const friendshipRouter = Router();

friendshipRouter.get("/", FriendshipControllers.getUserFriendships);
friendshipRouter.post(
  "/accept",
  zodValidate({ body: AcceptFriendshipDTO }),
  FriendshipControllers.acceptFriendship
);
friendshipRouter.post(
  "/",
  zodValidate({ body: CreateFriendshipDTO }),
  FriendshipControllers.createFriendship
);
friendshipRouter.delete(
  "/",
  zodValidate({ body: DeleteFriendshipDTO }),
  FriendshipControllers.deleteFriendship
);

export default friendshipRouter;

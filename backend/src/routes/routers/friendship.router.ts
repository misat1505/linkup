import { Router } from "express";
import { FriendshipControllers } from "@/controllers";
import { validate } from "@/middlewares/validate";
import {
  AcceptFriendshipDTO,
  CreateFriendshipDTO,
  DeleteFriendshipDTO,
} from "@/validators/friendships/friendships.validators";

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
  validate({ body: AcceptFriendshipDTO }),
  FriendshipControllers.acceptFriendship
);
friendshipRouter.post(
  "/",
  validate({ body: CreateFriendshipDTO }),
  FriendshipControllers.createFriendship
);
friendshipRouter.delete(
  "/",
  validate({ body: DeleteFriendshipDTO }),
  FriendshipControllers.deleteFriendship
);

export default friendshipRouter;

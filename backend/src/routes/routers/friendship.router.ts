import { Router } from "express";
import { getUserFriendships } from "../../controllers/friendships/getUserFriendships.controller";
import { createFriendship } from "../../controllers/friendships/createFriendship.controller";

const friendshipRouter = Router();

friendshipRouter.get("/", getUserFriendships);
friendshipRouter.post("/", createFriendship);

export default friendshipRouter;

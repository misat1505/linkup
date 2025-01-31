import { Router } from "express";
import { searchUserController } from "../../controllers/user/searchUser.controller";

/**
 * User Routes Router.
 *
 * This router handles user-related operations, including searching for users.
 */
const userRouter = Router();

userRouter.get("/search", searchUserController);

export default userRouter;

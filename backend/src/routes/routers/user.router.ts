import { Router } from "express";
import { UserControllers } from "../../controllers";

/**
 * User Routes Router.
 *
 * This router handles user-related operations, including searching for users.
 */
const userRouter = Router();

userRouter.get("/search", UserControllers.searchUser);

export default userRouter;

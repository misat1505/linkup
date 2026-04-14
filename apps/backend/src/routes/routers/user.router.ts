import { Router } from "express";
import { UserControllers } from "@/controllers";
import { validate } from "@/middlewares/validate";
import { SearchUserQuery } from "@/validators/users/users.validators";

/**
 * User Routes Router.
 *
 * This router handles user-related operations, including searching for users.
 */
const userRouter = Router();

userRouter.get(
  "/search",
  validate({ query: SearchUserQuery }),
  UserControllers.searchUser
);

export default userRouter;

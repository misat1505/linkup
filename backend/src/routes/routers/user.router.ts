import { Router } from "express";
import { searchUserController } from "../../controllers/user/searchUser.controller";

const userRouter = Router();

userRouter.get("/search", searchUserController);

export default userRouter;

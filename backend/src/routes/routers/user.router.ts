import { Router } from "express";
import { searchUser } from "../../controllers/user.controller";

const userRouter = Router();

userRouter.get("/search", searchUser);

export default userRouter;

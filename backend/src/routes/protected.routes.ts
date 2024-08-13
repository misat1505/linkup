import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import authRouterProtected from "./routers/auth.router";
import fileRouter from "./routers/file.router";
import { updateLastActive } from "../middlewares/updateLastActive";
import userRouter from "./routers/user.router";

const protectedRoutes = Router();

protectedRoutes.use(authorize);
protectedRoutes.use(updateLastActive);

protectedRoutes.use("/auth", authRouterProtected);
protectedRoutes.use("/files", fileRouter);
protectedRoutes.use("/users", userRouter);

export default protectedRoutes;

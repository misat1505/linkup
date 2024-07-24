import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import authRouterProtected from "./routers/auth.router";
import fileRouter from "./routers/file.router";
import { updateLastActive } from "../middlewares/updateLastActive";

const protectedRoutes = Router();

protectedRoutes.use(authorize);
protectedRoutes.use(updateLastActive);

protectedRoutes.use("/auth", authRouterProtected);
protectedRoutes.use("/files", fileRouter);

export default protectedRoutes;

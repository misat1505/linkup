import { Router } from "express";
import authRouter from "./routers/auth.public.router";

const publicRoutes = Router();

publicRoutes.use("/auth", authRouter);

export default publicRoutes;

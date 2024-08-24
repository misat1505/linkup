import { Router } from "express";
import authRouter from "./routers/auth.public.router";
import { reactions } from "../config/reactions";

const publicRoutes = Router();

publicRoutes.use("/auth", authRouter);
publicRoutes.get("/chats/reactions", (req, res) => {
  return res.status(200).json({ reactions });
});

export default publicRoutes;

import { Router } from "express";
import authRouter from "./routers/auth.public.router";
import { reactions } from "../config/reactions";
import { env } from "../config/env";
import { resetDB } from "../../tests/utils/setup";

const publicRoutes = Router();

publicRoutes.use("/auth", authRouter);
publicRoutes.get("/chats/reactions", (req, res) => {
  return res.status(200).json({ reactions });
});

if (env.NODE_ENV === "e2e") {
  publicRoutes.post("/reset-db", async (req, res, next) => {
    try {
      await resetDB();
      return res.status(200).json({ message: "Successfully reset db." });
    } catch (e) {
      next(new Error("Error when resetting db."));
    }
  });
}

export default publicRoutes;

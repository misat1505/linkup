import { Router } from "express";
import { reactions } from "../config/reactions";
import { env } from "../config/env";
import { resetDB } from "../../tests/utils/setup";
import { Routers } from "./routers";

/**
 * Public Routes Router.
 *
 * This router contains routes that are publicly accessible and do not require authorization.
 * The routes include authentication and reactions fetching, and a special route for resetting the database
 * in the `e2e` (end-to-end) environment.
 */
const publicRoutes = Router();

publicRoutes.use("/auth", Routers.auth.public);
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

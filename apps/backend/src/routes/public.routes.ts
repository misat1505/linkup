import { env } from "@/config/env";
import { reactions } from "@/config/reactions";
import { resetDB } from "@tests/utils/setup";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Routers } from "./routers";

/**
 * Public Routes Router.
 *
 * This router contains routes that are publicly accessible and do not require authorization.
 * The routes include authentication and reactions fetching, and a special route for resetting the database
 * in the `e2e` (end-to-end) environment.
 */
const publicRoutes = Router();

publicRoutes.use(Routers.auth.public);
publicRoutes.get("/chats/reactions", (req, res) => {
  return res.status(StatusCodes.OK).json({ reactions });
});

if (env.NODE_ENV === "e2e") {
  publicRoutes.post("/reset-db", async (req, res, next) => {
    try {
      await resetDB();
      return res
        .status(StatusCodes.OK)
        .json({ message: "Successfully reset db." });
    } catch {
      next(new Error("Error when resetting db."));
    }
  });
}

export default publicRoutes;

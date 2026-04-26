import { env } from "@/config/env";
import { reactions } from "@/config/reactions";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
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
publicRoutes[API_CONTRACT.GET_REACTIONS.method](
  API_CONTRACT.GET_REACTIONS.path,
  (req, res) => {
    const respond = buildValidatedResponder(res, CONTRACT_KEYS.GET_REACTIONS);
    return respond(StatusCodes.OK, { reactions });
  },
);

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

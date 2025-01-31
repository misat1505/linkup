import { env } from "./env";
import cors from "cors";

/**
 * Configuration object for CORS middleware.
 *
 * @remarks
 * This configuration allows requests only from the frontend URL specified in the environment variables.
 */
export const corsConfig = {
  origin: env.FRONTEND_URL,
  credentials: true,
};

/**
 * CORS middleware configured using `corsConfig`.
 *
 * @remarks
 * This middleware enables CORS with the specified configuration.
 */
export const corsMiddleware = cors(corsConfig);

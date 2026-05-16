import cors from "cors";
import { env } from "./env";

/**
 * Configuration object for CORS middleware.
 *
 * @remarks
 * This configuration allows requests only from the frontend URL specified in the environment variables.
 *
 * @source
 */
const corsConfig = {
	origin: env.FRONTEND_URL,
	credentials: true,
};

/**
 * CORS middleware configured using `corsConfig`.
 *
 * @remarks
 * This middleware enables CORS with the specified configuration.
 *
 * @source
 */
export const corsMiddleware = cors(corsConfig);

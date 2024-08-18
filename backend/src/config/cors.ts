import { env } from "./env";
import cors from "cors";

export const corsConfig = {
  origin: env.FRONTEND_URL,
  credentials: true,
};

export const corsMiddleware = cors(corsConfig);

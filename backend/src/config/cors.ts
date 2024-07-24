import { env } from "./env";
import cors from "cors";

export const corsConfig = cors({
  origin: env.FRONTEND_URL,
  credentials: true,
});

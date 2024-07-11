import { FRONTEND_URL } from "../constants";
import cors from "cors";

export const corsConfig = cors({
  origin: FRONTEND_URL,
  credentials: true,
});

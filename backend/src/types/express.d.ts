import { AppServices } from "../utils/initializeServices";
import { UserWithCredentials } from "./User";

declare global {
  namespace Express {
    interface Application {
      services: AppServices;
    }

    interface Request {
      user?: UserWithCredentials;
    }
  }
}

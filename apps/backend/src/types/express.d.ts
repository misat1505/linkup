import { AppServices } from "@/utils/initializeServices";
import { RequestValidatedValues } from "./RequestValidation";
import { UserWithCredentials } from "./User";

declare global {
  namespace Express {
    interface Application {
      services: AppServices;
    }

    interface Request {
      user?: UserWithCredentials;
      validated?: RequestValidatedValues;
    }
  }
}

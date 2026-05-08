import { AppServices } from "@/utils/initialize-services";
import { RequestValidatedValues } from "./request-validation";
import { UserWithCredentials } from "./user";

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

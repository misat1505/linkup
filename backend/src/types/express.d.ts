import { AppServices } from "../utils/initializeServices";

declare global {
  namespace Express {
    interface Application {
      services: AppServices;
    }
  }
}

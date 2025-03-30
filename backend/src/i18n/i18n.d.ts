import "i18next";
import { Translations } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: Translations;
    };
  }
}

import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: Translations;
    };
  }
}

type SuccessOrFailure = {
  success: string;
  failure: string;
};

type Translations = {
  auth: AuthTranslations;
};

type AuthTranslations = {
  controllers: {
    login: {
      "invalid-login": string;
      "invalid-password": string;
      "login-failed": string;
    };
    "get-self": {
      "user-not-found": string;
      "cannot-fetch-user": string;
    };
    logout: SuccessOrFailure;
    refresh: SuccessOrFailure;
    signup: {
      "login-already-exists": string;
      failure: string;
    };
    update: {
      "login-already-exists": string;
      failure: string;
    };
  };
};

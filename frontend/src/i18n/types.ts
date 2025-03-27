export type Translation = {
  login: LoginTranslations;
  settings: SettingsTranslations;
};

type LoginTranslations = {
  greeting: string;
  slogan: string;
  form: {
    placeholders: {
      login: string;
      password: string;
    };
    submit: {
      idle: string;
      pending: string;
    };
    errors: {
      login: {
        min: string;
        max: string;
      };
      password: {
        min: string;
      };
    };
  };
  "no-account": string;
  "sign-in-redirect": string;
};

type SettingsTranslations = {
  theme: {
    title: string;
    description: string;
  };
  tooltips: {
    title: string;
    description: string;
  };
  slogan: string;
  header: {
    1: string;
    2: string;
  };
};

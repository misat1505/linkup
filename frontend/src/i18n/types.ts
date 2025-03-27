export type Translation = {
  login: LoginTranslations;
  settings: SettingsTranslations;
};

type LoginTranslations = {
  greeting: string;
  slogan: string;
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

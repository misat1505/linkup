export type Translation = {
  login: LoginTranslations;
  signup: SignupTranslations;
  settings: SettingsTranslations;
  common: {
    navbar: NavbarTranslations;
  };
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

type SignupTranslations = {
  header: {
    1: string;
    2: string;
  };
  slogan: string;
  form: {
    placeholders: {
      firstname: string;
      lastname: string;
      login: string;
      password: string;
      "confirm-password": string;
    };
    errors: {
      firstname: {
        min: string;
        max: string;
      };
      lastname: {
        min: string;
        max: string;
      };
      login: {
        min: string;
        max: string;
      };
      password: {
        min: string;
        mismatch: string;
      };
    };
    "remove-image": string;
    submit: {
      idle: string;
      pending: string;
    };
  };
  "already-have-account": string;
  "login-redirect": string;
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
  form: {
    submit: {
      idle: string;
      pending: string;
    };
  };
};

type NavbarTranslations = {
  logo: {
    tooltip: string;
  };
  search: {
    placeholder: string;
    "no-users": string;
    tooltip: string;
    heading: string;
    message: {
      button: {
        tooltip: string;
      };
    };
    friendships: {
      button: {
        tooltip: string;
      };
      toasts: {
        "already-exists": {
          title: string;
          description: string;
          action: string;
        };
        "successfully-created": {
          title: string;
          description: string;
          action: string;
        };
      };
    };
  };
};

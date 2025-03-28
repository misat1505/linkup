export type Translation = {
  login: LoginTranslations;
  signup: SignupTranslations;
  settings: SettingsTranslations;
  home: HomeTranslations;
  posts: PostsTranslations;
  friends: FriendsTranslations;
  chats: ChatsTranslations;
  common: {
    navbar: NavbarTranslations;
    theme: ThemeTranslations;
    loading: string;
    you: string;
    time: TimeAgoTranslations;
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
  sheet: {
    trigger: { tooltip: string };
    title: {
      anonymous: string;
      "logged-in": string;
    };
    items: {
      home: string;
      chats: string;
      settings: string;
      posts: string;
      friends: string;
      login: string;
      signup: string;
      logout: {
        trigger: string;
        dialog: {
          title: string;
          description: string;
          cancel: string;
          confirm: string;
        };
      };
    };
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

type ThemeTranslations = {
  light: string;
  dark: string;
  switch: {
    tooltip: string;
  };
};

type HomeTranslations = {
  feed: {
    empty: {
      title: string;
      description: string;
      action: string;
    };
  };
};

type PostsTranslations = {
  preview: {
    "show-more": string;
    "show-less": string;
  };
  new: {
    button: string;
  };
  edit: {
    button: { tooltip: string };
  };
  delete: {
    button: { tooltip: string };
    dialog: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
  };
  comments: {
    section: {
      open: string;
      close: string;
    };
    tooltip: {
      you: string;
      messageInfo: string;
      locale: string;
    };
    buttons: {
      reply: { tooltip: string };
      extend: { tooltip: string };
      reduce: { tooltip: string };
    };
    form: {
      inputs: {
        text: {
          placeholder: string;
        };
        file: { tooltip: string; remove: string };
      };
      submit: { tooltip: string };
      reply: {
        to: {
          me: string;
          other: string;
        };
        remove: { tooltip: string };
      };
    };
  };
};

type TimeAgoTranslations = {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  now: string;
};

type FriendsTranslations = {
  filter: {
    input: { placeholder: string };
    statuses: {
      input: {
        placeholder: string;
        all: string;
        accepted: string;
        "awaiting-me": string;
        "awaiting-other": string;
      };
      all: string;
      accepted: string;
      "awaiting-me": string;
      "awaiting-other": string;
    };
  };
  column: {
    user: { title: string };
    status: { title: string };
  };
  "no-result": {
    title: string;
    description: string;
    link: { text: string };
  };
  cells: {
    statuses: {
      accepted: string;
      "awaiting-me": string;
      "awaiting-other": string;
    };
    actions: {
      trigger: { tooltip: string };
      accept: string;
      delete: string;
    };
  };
  toasts: {
    accepted: {
      title: string;
      description: string;
    };
    deleted: {
      title: string;
      description: {
        accepted: string;
        "awaiting-me": string;
        "awaiting-other": string;
      };
    };
  };
};

type ChatsTranslations = {
  "no-chat-selected": {
    title: string;
    description: string;
    action: string;
  };
  "chat-unavailable": {
    title: string;
    description: string;
    action: string;
  };
  navigation: {
    title: string;
    items: {
      tooltip: string;
      "only-file-text": string;
    };
  };
  "create-new-chat": {
    trigger: { tooltip: string };
    dialog: {
      title: string;
      description: string;
    };
    tabs: {
      private: string;
      group: string;
    };
    private: {
      form: {
        input: {
          placeholder: string;
        };
      };
    };
    group: {
      form: {
        inputs: {
          name: { placeholder: string };
          search: { placeholder: string };
        };
      };
    };
    "invited-users": string;
    submit: string;
  };
  form: {
    inputs: {
      text: { placeholder: string };
      file: { tooltip: string; remove: string };
    };
    submit: { tooltip: string };
    reply: {
      author: { me: string; other: string };
      "only-files": string;
      cancel: { tooltip: string };
    };
  };
};

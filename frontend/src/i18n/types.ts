export type Translation = {
  tabs: TabsTranslations;
  "not-found": NotFoundTranslations;
  login: LoginTranslations;
  signup: SignupTranslations;
  settings: SettingsTranslations;
  home: HomeTranslations;
  posts: PostsTranslations;
  editor: EditorTranslations;
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

type TabsTranslations = {
  "close-chat": string;
  chats: string;
  friends: string;
  home: string;
  login: string;
  "not-found": string;
  editor: string;
  posts: string;
  settings: string;
  signup: string;
};

type NotFoundTranslations = {
  description: string;
  button: string;
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
  error: {
    toast: {
      title: string;
    };
  };
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
      toast: {
        title: string;
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
  language: {
    title: string;
    description: string;
  };
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
    error: {
      toast: {
        title: string;
      };
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
  report: {
    dialog: {
      trigger: {
        tooltip: string;
      };
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
    toast: {
      title: string;
      description: string;
    };
  };
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
      toasts: {
        success: { title: string };
        error: { title: string };
      };
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
  ago: string;
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
  "chat-start": {
    "created-at": string;
    greeting: string;
  };
  sockets: {
    errors: {
      connection: {
        toast: {
          title: string;
          description: string;
        };
      };
    };
  };
  "no-chats": string;
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
      error: {
        toast: { title: string };
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
    error: {
      toast: {
        title: string;
      };
    };
  };
  "income-message": {
    text: string;
    "only-files": string;
  };
  "date-seperator": {
    locale: string;
    options: {
      short: string;
      long: string;
      "message-tooltip": string;
    };
  };
  message: {
    tooltip: {
      mine: string;
      foreign: string;
    };
    controls: {
      reply: { tooltip: string };
      reaction: {
        trigger: { tooltip: string };
        title: string;
        "already-reacted": string;
        "not-available": string;
        values: {
          happy: string;
          sad: string;
          crying: string;
          heart: string;
          skull: string;
        };
      };
    };
    reply: {
      "only-files": string;
      text: {
        "you-to-you": string;
        "you-to-other": string;
        "other-to-you": string;
        "other-to-other": string;
        "other-to-same": string;
      };
    };
  };
  leave: {
    trigger: { tooltip: string };
    dialog: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
  };
  "user-activity": {
    online: string;
    offline: string;
    "time-units": {
      min: string;
      hr: string;
    };
  };
  close: {
    tooltip: string;
  };
  settings: {
    trigger: { tooltip: string };
    title: string;
    description: {
      private: string;
      group: string;
    };
    users: {
      actions: {
        "send-message": { tooltip: string };
        "update-alias": { tooltip: string };
      };
    };
    "update-alias-dialog": {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
      input: { placeholder: string };
      "no-alias": string;
    };
    group: {
      tabs: {
        general: string;
        members: string;
        invite: string;
      };
      info: {
        input: {
          name: { placeholder: string };
          file: { remove: string };
        };
        submit: string;
      };
      invite: {
        search: { placeholder: string };
        empty: string;
        "no-result": string;
        trigger: { tooltip: string };
        dialog: {
          title: string;
          description: string;
          cancel: string;
          confirm: string;
        };
      };
    };
  };
};

type EditorTranslations = {
  toasts: {
    "created-successfully": {
      title: string;
    };
    "updated-successfully": {
      title: string;
    };
    "create-error": {
      title: string;
    };
    "update-error": {
      title: string;
    };
  };
  "file-dialog": {
    title: string;
    description: string;
    "cache-empty": string;
    "used-files": string;
    "file-upload": { tooltip: string };
    cache: string;
    item: {
      "copy-to-clipboard": {
        tooltip: string;
        toast: string;
      };
      remove: {
        trigger: { tooltip: string };
        dialog: {
          title: string;
          description: string;
          cancel: string;
          confirm: string;
        };
      };
    };
  };
};

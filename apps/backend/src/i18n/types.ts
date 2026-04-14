type Failure = {
  failure: string;
};

type SuccessOrFailure = Failure & {
  success: string;
};

type Unauthorized = {
  unauthorized: string;
};

type NotFound = {
  "not-found": string;
};

export type Translations = {
  auth: AuthTranslations;
  chats: ChatsTranslations;
  files: FilesTranslations;
  friends: FriendsTranslations;
  posts: PostsTranslations;
  users: UsersTranslations;
};

type AuthTranslations = {
  controllers: {
    login: Failure & {
      "invalid-login": string;
      "invalid-password": string;
    };
    "get-self": Failure & {
      "user-not-found": string;
    };
    logout: SuccessOrFailure;
    refresh: SuccessOrFailure;
    signup: Failure & {
      "login-already-exists": string;
    };
    update: Failure & {
      "login-already-exists": string;
    };
  };
  validators: {
    login: {
      login: {
        empty: string;
        "not-string": string;
        "bad-length": string;
      };
      password: {
        empty: string;
        "not-string": string;
        "bad-length": string;
      };
    };
    signup: {
      firstName: {
        "not-exists": string;
        "not-string": string;
        empty: string;
        "bad-length": string;
      };
      lastName: {
        "not-exists": string;
        "not-string": string;
        empty: string;
        "bad-length": string;
      };
      login: {
        empty: string;
        "not-string": string;
        "bad-length": string;
      };
      password: {
        empty: string;
        "not-string": string;
        "bad-length": string;
      };
    };
  };
};

type ChatsTranslations = {
  validators: {
    "create-private-chat": {
      users: {
        "not-2": string;
        each: {
          "is-not-uuid": string;
        };
      };
    };
    "create-group-chat": {
      users: {
        empty: string;
        each: {
          "is-not-uuid": string;
        };
      };
      name: { "bad-length": string };
    };
    "create-message": {
      content: { "bad-length": string };
      responseId: { "is-not-uuid": string };
    };
    "create-reaction": {
      messageId: { "is-not-uuid": string };
      reactionId: { "is-not-uuid": string };
    };
    "update-alias": {
      alias: {
        "bad-length": string;
      };
    };
    "add-user-to-group-chat": {
      userId: { "is-not-uuid": string };
    };
    "update-group-chat": {
      name: { "bad-length": string };
    };
  };
  controllers: {
    "add-user-to-group-chat": Failure & {
      "bad-chat-type": string;
      "i-am-not-in-chat": string;
      "user-already-in-chat": string;
    };
    "create-group-chat": Failure & {
      "not-belonging-to-you": string;
    };
    "create-message": Failure & {
      "user-not-belonging-to-chat": string;
      "response-not-existent": string;
    };
    "create-private-chat": Failure & {
      "not-belonging-to-you": string;
    };
    "create-reaction": Failure & {
      "bad-chat": string;
      "bad-message": string;
    };
    "delete-self-from-chat": SuccessOrFailure & {
      "bad-chat-type": string;
      "not-belonging-to-you": string;
    };
    "get-messages": Unauthorized & Failure;
    "get-self-chats": Failure;
    "update-group-chat": Unauthorized &
      Failure & {
        "bad-type": string;
      };
    "update-alias": Failure &
      Unauthorized & {
        "user-not-in-chat": string;
      };
  };
};

type FilesTranslations = {
  controllers: {
    "delete-from-cache": SuccessOrFailure;
    "get-cache": Failure;
    "get-file": Failure &
      NotFound & {
        "default-error-message": string;
        "wrong-filter": string;
        "bad-chat": string;
        "bad-post": string;
        "avatar-not-found": string;
        "group-photo-not-found": string;
      };
    "insert-to-cache": Failure & {
      "no-file": string;
      "limit-reached": string;
    };
  };
};

type FriendsTranslations = {
  controllers: {
    accept: Failure & Unauthorized & NotFound;
    create: Failure &
      Unauthorized & {
        "already-exists": string;
      };
    delete: SuccessOrFailure & Unauthorized & NotFound;
    get: Failure;
  };
};

type PostsTranslations = {
  controllers: {
    create: Failure;
    delete: SuccessOrFailure & Unauthorized & NotFound;
    "get-single": Failure & NotFound;
    "get-all": Failure;
    "get-users": Failure;
    update: Failure & Unauthorized & NotFound;
    report: SuccessOrFailure & {
      "already-reported": string;
    };
  };
};

type UsersTranslations = {
  controllers: {
    search: Failure & {
      "term-required": string;
    };
  };
};

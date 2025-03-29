type Failure = {
  failure: string;
};

type SuccessOrFailure = Failure & {
  success: string;
};

type Unauthorized = {
  unauthorized: string;
};

export type Translations = {
  auth: AuthTranslations;
  chats: ChatsTranslations;
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
};

type ChatsTranslations = {
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

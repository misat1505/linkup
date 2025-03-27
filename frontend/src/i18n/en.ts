import { Translation } from "./types";

export const en: { translation: Translation } = {
  translation: {
    login: {
      greeting: "Welcome to",
      slogan:
        "Immerse yourself in a social network where connecting with friends, sharing your moments, and discovering new communities is just a click away.",
      form: {
        placeholders: {
          login: "Login",
          password: "Password",
        },
        submit: {
          idle: "Sign in",
          pending: "Signing in...",
        },
        errors: {
          login: {
            min: "Login must be at least 5 characters long.",
            max: "Login must be at most 50 characters long.",
          },
          password: {
            min: "Password must be at least 5 characters long.",
          },
        },
      },
      "no-account": "Don't have an account?",
      "sign-in-redirect": "Signup",
    },
    signup: {
      header: {
        1: "Join the",
        2: "Network",
      },
      slogan:
        "Start your journey today and discover a world of connections and opportunities.",
      form: {
        placeholders: {
          firstname: "First name",
          lastname: "Last name",
          login: "Login",
          password: "Password",
          "confirm-password": "Confirm Password",
        },
        errors: {
          firstname: {
            min: "First name must not be empty.",
            max: "First name must be at most 50 characters long.",
          },
          lastname: {
            min: "Last name must not be empty.",
            max: "Last name must be at most 50 characters long.",
          },
          login: {
            min: "Login must be at least 5 characters long.",
            max: "Login must be at most 50 characters long.",
          },
          password: {
            min: "Password must be at least 5 characters long.",
            mismatch: "Passwords don't match.",
          },
        },
        "remove-image": "Remove",
        submit: {
          idle: "Sign up",
          pending: "Signing up...",
        },
      },
      "already-have-account": "Already have an account?",
      "login-redirect": "Login",
    },
    settings: {
      theme: {
        title: "Theme",
        description:
          "Switch between light and dark themes to suit your preference.",
      },
      tooltips: {
        title: "Tooltips",
        description:
          "Enable or disable tooltips for additional guidance in the app.",
      },
      slogan:
        "Customize your settings to make Link Up truly yours. Toggle themes, tweak preferences, and shape the way you interact with the platform.",
      header: {
        1: "Personalize",
        2: "Your Experience",
      },
      form: {
        submit: {
          idle: "Update",
          pending: "Updating...",
        },
      },
    },
  },
};

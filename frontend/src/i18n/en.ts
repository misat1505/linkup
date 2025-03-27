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
    },
  },
};

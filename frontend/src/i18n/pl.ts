import { Translation } from "./types";

export const pl: { translation: Translation } = {
  translation: {
    login: {
      greeting: "Witamy w",
      slogan:
        "Zanurz się w sieci społecznościowej, gdzie nawiązywanie kontaktów ze znajomymi, dzielenie się chwilami i odkrywanie nowych społeczności jest na wyciągnięcie ręki.",
      form: {
        placeholders: {
          login: "Login",
          password: "Hasło",
        },
        submit: {
          idle: "Zaloguj się",
          pending: "Trwa logowanie...",
        },
        errors: {
          login: {
            min: "Login musi mieć co najmniej 5 znaków.",
            max: "Login może mieć maksymalnie 50 znaków.  ",
          },
          password: {
            min: "Hasło musi mieć co najmniej 5 znaków.",
          },
        },
      },
      "no-account": "Nie masz konta?",
      "sign-in-redirect": "Zarejestruj się",
    },
    signup: {
      header: {
        1: "Dołącz do",
        2: "Społeczności",
      },
      slogan:
        "Rozpocznij swoją podróż już dziś i odkryj świat kontaktów oraz możliwości.",
      form: {
        placeholders: {
          firstname: "Imię",
          lastname: "Nazwisko",
          login: "Login",
          password: "Hasło",
          "confirm-password": "Potwierdź hasło",
        },
        errors: {
          firstname: {
            min: "Imię nie może być puste.",
            max: "Imię może mieć maksymalnie 50 znaków.",
          },
          lastname: {
            min: "Nazwisko nie może być puste.",
            max: "Nazwisko może mieć maksymalnie 50 znaków.",
          },
          login: {
            min: "Login musi mieć co najmniej 5 znaków.",
            max: "Login może mieć maksymalnie 50 znaków.",
          },
          password: {
            min: "Hasło musi mieć co najmniej 5 znaków.",
            mismatch: "Hasła nie są takie same.",
          },
        },
        "remove-image": "Usuń",
        submit: {
          idle: "Zarejestruj się",
          pending: "Rejestrowanie...",
        },
      },
      "already-have-account": "Masz już konto?",
      "login-redirect": "Zaloguj się",
    },
    settings: {
      theme: {
        title: "Motyw",
        description:
          "Przełączaj się między jasnym i ciemnym motywem, aby dopasować wygląd do swoich preferencji.",
      },
      tooltips: {
        title: "Podpowiedzi",
        description:
          "Włącz lub wyłącz podpowiedzi, aby uzyskać dodatkowe wskazówki w aplikacji.",
      },
      slogan:
        "Dostosuj ustawienia, aby Link Up był naprawdę Twój. Zmieniaj motywy, dostosowuj preferencje i kształtuj sposób, w jaki korzystasz z platformy.",
      header: {
        1: "Dostosuj Swoje",
        2: "Doświadczenie",
      },
      form: {
        submit: {
          idle: "Zaktualizuj",
          pending: "Aktualizowanie...",
        },
      },
    },
  },
};

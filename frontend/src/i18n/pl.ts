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
            max: "Login może mieć maksymalnie 50 znaków.",
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
    common: {
      you: "Ty",
      loading: "Chwileczkę, przygotowujemy aplikację...",
      navbar: {
        logo: {
          tooltip: "Strona Główna",
        },
        sheet: {
          trigger: { tooltip: "Pokaż akcje" },
          title: {
            "logged-in": "Witaj, {{fullName}}!",
            anonymous: "Witaj!",
          },
          items: {
            home: "Strona główna",
            chats: "Czaty",
            settings: "Ustawienia",
            posts: "Posty",
            friends: "Znajomi",
            login: "Zaloguj się",
            signup: "Utwórz nowe konto",
            logout: {
              trigger: "Wyloguj się",
              dialog: {
                title: "Czy na pewno chcesz to zrobić?",
                description:
                  "Czy na pewno chcesz się wylogować? Spowoduje to zakończenie Twojej sesji, a aby uzyskać dostęp do konta, będziesz musiał(a) zalogować się ponownie.",
                cancel: "Anuluj",
                confirm: "Tak, wyloguj się",
              },
            },
          },
        },
        search: {
          placeholder: "Szukaj na Link Up...",
          "no-users": "Brak wyników wyszukiwania.",
          tooltip: "Szukaj Użytkowników",
          heading: "Wyniki Wyszukiwania",
          message: {
            button: {
              tooltip: "Wyślij Wiadomość",
            },
          },
          friendships: {
            button: {
              tooltip: "Dodaj do Przyjaciół",
            },
            toasts: {
              "already-exists": {
                title: "Zaproszenie do znajomych już istnieje.",
                description:
                  "Istnieje już znajomość między tobą a {{fullName}}.",
                action: "Pokaż przyjaciół",
              },
              "successfully-created": {
                title: "Zaproszenie do znajomych wysłane.",
                description:
                  "Zaproszenie do znajomych zostało wysłane do {{fullName}}.",
                action: "Pokaż przyjaciół",
              },
            },
          },
        },
      },
      theme: {
        light: "jasny",
        dark: "ciemny",
        switch: {
          tooltip: "Przełącz na tryb {{mode}}",
        },
      },
      time: {
        years: "{{count}} lat temu",
        months: "{{count}} miesięcy temu",
        weeks: "{{count}} tygodni temu",
        days: "{{count}} dni temu",
        hours: "{{count}} godzin temu",
        minutes: "{{count}} minut temu",
        now: "Przed chwilą",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Nic tu jeszcze nie ma",
          description:
            "Rozpocznij rozmowę! Podziel się swoimi myślami, dodając pierwszy post.",
          action: "Napisz post",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Pokaż więcej",
        "show-less": "Pokaż mniej",
      },
      new: { button: "Utwórz nowy post" },
      edit: {
        button: { tooltip: "Edytuj" },
      },
      delete: {
        button: { tooltip: "Usuń" },
        dialog: {
          title: "Czy na pewno chcesz to zrobić?",
          description:
            "Czy na pewno chcesz usunąć ten post? Usunięcie posta spowoduje usunięcie komentarzy oraz wszystkich plików związanych z tym postem.",
          cancel: "Anuluj",
          confirm: "Tak, usuń",
        },
      },
      comments: {
        section: {
          open: "Otwórz sekcję komentarzy",
          close: "Zamknij sekcję komentarzy",
        },
        tooltip: {
          you: "Ty",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "pl-PL",
        },
        buttons: {
          reply: { tooltip: "Odpowiedz" },
          extend: { tooltip: "Pokaż odpowiedzi" },
          reduce: { tooltip: "Zamknij odpowiedzi" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "Zostaw komentarz...",
            },
            file: { tooltip: "Dodaj plik", remove: "Usuń plik" },
          },
          submit: { tooltip: "Wyślij komentarz" },
          reply: {
            to: {
              me: "Odpowiadasz sobie.",
              other: "Odpowiadasz użytkownikowi {{fullName}}.",
            },
            remove: { tooltip: "Usuń odpowiedź" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "Filtruj użytkowników..." },
        statuses: {
          input: {
            placeholder: "Filtruj użytkowników...",
            all: "Wszyscy",
            accepted: "Zaakceptowani",
            "awaiting-me": "Oczekujący na mnie",
            "awaiting-other": "Oczekujący na innych",
          },
          all: "Wszyscy ({{count}})",
          accepted: "Zaakceptowani ({{count}})",
          "awaiting-me": "Oczekujący na mnie ({{count}})",
          "awaiting-other": "Oczekujący na innych ({{count}})",
        },
      },
      column: {
        user: { title: "Użytkownik" },
        status: { title: "Status" },
      },
      "no-result": {
        title: "Brak wyników.",
        description: "Wyszukaj osoby za pomocą",
        link: { text: "paska nawigacji" },
      },
      cells: {
        statuses: {
          accepted: "Znajomi",
          "awaiting-me": "Oczekuje na twoje zatwierdzenie",
          "awaiting-other": "Oczekuje na zatwierdzenie przez {{fullName}}",
        },
        actions: {
          trigger: { tooltip: "Pokaż akcje" },
          accept: "Zaakceptuj",
          delete: "Usuń",
        },
      },
      toasts: {
        accepted: {
          title: "Przyjaźń zaakceptowana.",
          description: "{{fullName}} jest teraz twoim przyjacielem.",
        },
        deleted: {
          title: "Przyjaźń usunięta.",
          description: {
            accepted: "{{fullName}} nie jest już twoim przyjacielem.",
            "awaiting-me":
              "Prośba o dodanie do przyjaciół od {{fullName}} została odrzucona.",
            "awaiting-other":
              "Prośba o dodanie do przyjaciół {{fullName}} została anulowana.",
          },
        },
      },
    },
    chats: {
      "no-chat-selected": {
        title: "Brak wybranego czatu.",
        description: "Wybierz istniejący czat z menu lub",
        action: "Utwórz nowy czat",
      },
      "chat-unavailable": {
        title: "Czat niedostępny.",
        description:
          "Wybrany czat nie istnieje lub nie jest dostępny dla Ciebie.",
        action: "Zamknij",
      },
      navigation: {
        title: "Czatuj z innymi",
        items: {
          tooltip: "Otwórz czat",
          "only-file-text": "{{fullName}} wysłał(a) {{count}} plik(ów).",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "Utwórz czat" },
        dialog: {
          title: "Utwórz nowy czat",
          description:
            "Wyszukaj i zaproś innych użytkowników do nowo utworzonego czatu. Kliknij na użytkownika, aby zaprosić go do czatu.",
        },
        tabs: {
          private: "Prywatny",
          group: "Grupowy",
        },
        private: {
          form: {
            input: {
              placeholder: "Szukaj osób...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "Nazwa czatu (opcjonalnie)" },
              search: { placeholder: "Szukaj osób..." },
            },
          },
        },
        "invited-users": "Zaproszone osoby",
        submit: "Utwórz czat",
      },
      form: {
        inputs: {
          text: { placeholder: "Napisz..." },
          file: { tooltip: "Załącz plik", remove: "Usuń plik" },
        },
        submit: { tooltip: "Wyślij wiadomość" },
        reply: {
          author: {
            me: "Odpowiadasz do siebie",
            other: "Odpowiadasz do {{name}}",
          },
          "only-files": "Wysłał(a) {{count}} plik(ów).",
          cancel: { tooltip: "Anuluj" },
        },
      },
      "income-message": {
        text: "{{name}}: {{text}}",
        "only-files": "{{name}} wysłał(a) {{count}} plik(ów).",
      },
      "date-seperator": {
        locale: "pl-PL",
        options: {
          short: JSON.stringify({
            hour: "2-digit",
            minute: "2-digit",
          }),
          long: JSON.stringify({
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          }),
          "message-tooltip": JSON.stringify({
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      },
      message: {
        tooltip: {
          mine: "{{date}} przez Ciebie",
          foreign: "{{date}} przez {{name}}",
        },
        controls: {
          reply: { tooltip: "Odpowiedz" },
          reaction: {
            trigger: { tooltip: "Zareaguj" },
            title: "Utwórz swoją reakcję",
            "already-reacted": "Już utworzyłeś reakcję dla tej wiadomości.",
            "not-available": "Reakcje są niedostępne w tej chwili.",
            values: {
              happy: "szczęśliwy",
              sad: "smutny",
              crying: "płaczący",
              heart: "serce",
              skull: "czaszka",
            },
          },
        },
      },
    },
  },
};

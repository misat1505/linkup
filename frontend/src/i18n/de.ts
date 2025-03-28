import { Translation } from "./types";

export const de: { translation: Translation } = {
  translation: {
    login: {
      greeting: "Willkommen bei",
      slogan:
        "Tauche ein in ein soziales Netzwerk, in dem du mit Freunden in Kontakt bleiben, deine Momente teilen und neue Gemeinschaften entdecken kannst – alles nur einen Klick entfernt.",
      form: {
        placeholders: {
          login: "Anmeldename",
          password: "Passwort",
        },
        submit: {
          idle: "Anmelden",
          pending: "Wird angemeldet...",
        },
        errors: {
          login: {
            min: "Der Anmeldename muss mindestens 5 Zeichen lang sein.",
            max: "Der Anmeldename darf höchstens 50 Zeichen lang sein.",
          },
          password: {
            min: "Das Passwort muss mindestens 5 Zeichen lang sein.",
          },
        },
      },
      "no-account": "Hast du noch kein Konto?",
      "sign-in-redirect": "Registrieren",
    },
    signup: {
      header: {
        1: "Tritt dem",
        2: "Netzwerk bei",
      },
      slogan:
        "Starte noch heute deine Reise und entdecke eine Welt voller Verbindungen und Möglichkeiten.",
      form: {
        placeholders: {
          firstname: "Vorname",
          lastname: "Nachname",
          login: "Anmeldename",
          password: "Passwort",
          "confirm-password": "Passwort bestätigen",
        },
        errors: {
          firstname: {
            min: "Der Vorname darf nicht leer sein.",
            max: "Der Vorname darf höchstens 50 Zeichen lang sein.",
          },
          lastname: {
            min: "Der Nachname darf nicht leer sein.",
            max: "Der Nachname darf höchstens 50 Zeichen lang sein.",
          },
          login: {
            min: "Der Anmeldename muss mindestens 5 Zeichen lang sein.",
            max: "Der Anmeldename darf höchstens 50 Zeichen lang sein.",
          },
          password: {
            min: "Das Passwort muss mindestens 5 Zeichen lang sein.",
            mismatch: "Die Passwörter stimmen nicht überein.",
          },
        },
        "remove-image": "Entfernen",
        submit: {
          idle: "Registrieren",
          pending: "Wird registriert...",
        },
      },
      "already-have-account": "Hast du bereits ein Konto?",
      "login-redirect": "Anmelden",
    },
    settings: {
      language: {
        title: "Sprache",
        description:
          "Wähle deine bevorzugte Sprache für die Benutzeroberfläche.",
      },
      theme: {
        title: "Design",
        description:
          "Wechsle zwischen hellem und dunklem Design nach deinen Vorlieben.",
      },
      tooltips: {
        title: "Tooltips",
        description:
          "Aktiviere oder deaktiviere Tooltips für zusätzliche Hinweise in der App.",
      },
      slogan:
        "Passe deine Einstellungen an, um Link Up ganz nach deinem Geschmack zu gestalten. Wechsle Designs, ändere Vorlieben und bestimme, wie du mit der Plattform interagierst.",
      header: {
        1: "Personalisiere",
        2: "Dein Erlebnis",
      },
      form: {
        submit: {
          idle: "Aktualisieren",
          pending: "Wird aktualisiert...",
        },
      },
    },
    common: {
      you: "Du",
      loading: "Warte kurz, während wir die App vorbereiten...",
      navbar: {
        sheet: {
          trigger: { tooltip: "Aktionen anzeigen" },
          title: {
            "logged-in": "Willkommen, {{fullName}}!",
            anonymous: "Willkommen!",
          },
          items: {
            home: "Startseite",
            chats: "Chats",
            settings: "Einstellungen",
            posts: "Beiträge",
            friends: "Freunde",
            login: "Anmelden",
            signup: "Neues Konto erstellen",
            logout: {
              trigger: "Abmelden",
              dialog: {
                title: "Bist du absolut sicher?",
                description:
                  "Möchtest du dich wirklich abmelden? Damit wird deine Sitzung beendet und du musst dich erneut anmelden, um auf dein Konto zuzugreifen.",
                cancel: "Abbrechen",
                confirm: "Ja, abmelden",
              },
            },
          },
        },
        logo: {
          tooltip: "Startseite",
        },
        search: {
          placeholder: "Auf Link Up suchen...",
          "no-users": "Keine Benutzer gefunden.",
          tooltip: "Nach Benutzern suchen",
          heading: "Suchergebnis",
          message: {
            button: {
              tooltip: "Nachricht senden",
            },
          },
          friendships: {
            button: {
              tooltip: "Freund hinzufügen",
            },
            toasts: {
              "already-exists": {
                title: "Freundschaftsanfrage existiert bereits.",
                description:
                  "Es besteht bereits eine Freundschaft zwischen dir und {{fullName}}.",
                action: "Freunde anzeigen",
              },
              "successfully-created": {
                title: "Freundschaftsanfrage gesendet.",
                description:
                  "Die Freundschaftsanfrage wurde an {{fullName}} gesendet.",
                action: "Freunde anzeigen",
              },
            },
          },
        },
      },
      theme: {
        light: "hell",
        dark: "dunkel",
        switch: {
          tooltip: "Zum {{mode}} Modus wechseln",
        },
      },
      time: {
        years: "vor {{count}} Jahren",
        months: "vor {{count}} Monaten",
        weeks: "vor {{count}} Wochen",
        days: "vor {{count}} Tagen",
        hours: "vor {{count}} Stunden",
        minutes: "vor {{count}} Minuten",
        now: "Gerade eben",
        ago: "vor",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Hier ist noch nichts",
          description:
            "Starte die Unterhaltung! Teile deine Gedanken, indem du den ersten Beitrag erstellst.",
          action: "Beitrag schreiben",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Mehr anzeigen",
        "show-less": "Weniger anzeigen",
      },
      new: { button: "Neuen Beitrag erstellen" },
      edit: {
        button: { tooltip: "Bearbeiten" },
      },
      delete: {
        button: { tooltip: "Löschen" },
        dialog: {
          title: "Bist du absolut sicher?",
          description:
            "Möchtest du diesen Beitrag wirklich löschen? Dadurch werden dein Beitrag, seine Kommentare und alle damit verbundenen Dateien gelöscht.",
          cancel: "Abbrechen",
          confirm: "Ja, löschen",
        },
      },
      comments: {
        section: {
          open: "Kommentare öffnen",
          close: "Kommentare schließen",
        },
        tooltip: {
          you: "Du",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "de-DE",
        },
        buttons: {
          reply: { tooltip: "Antworten" },
          extend: { tooltip: "Antworten anzeigen" },
          reduce: { tooltip: "Antworten schließen" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "Hinterlasse deinen Kommentar...",
            },
            file: { tooltip: "Datei anhängen", remove: "Datei entfernen" },
          },
          submit: { tooltip: "Kommentar senden" },
          reply: {
            to: {
              me: "Antwort an dich selbst.",
              other: "Antwort an {{fullName}}.",
            },
            remove: { tooltip: "Antwort entfernen" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "Benutzer filtern..." },
        statuses: {
          input: {
            placeholder: "Benutzer filtern...",
            all: "Alle",
            accepted: "Akzeptiert",
            "awaiting-me": "Wartet auf mich",
            "awaiting-other": "Wartet auf andere",
          },
          all: "Alle ({{count}})",
          accepted: "Akzeptiert ({{count}})",
          "awaiting-me": "Wartet auf mich ({{count}})",
          "awaiting-other": "Wartet auf andere ({{count}})",
        },
      },
      column: {
        user: { title: "Benutzer" },
        status: { title: "Status" },
      },
      "no-result": {
        title: "Keine Ergebnisse.",
        description: "Suche nach Personen über die",
        link: { text: "Navigationsleiste" },
      },
      cells: {
        statuses: {
          accepted: "Freunde",
          "awaiting-me": "Wartet auf deine Zustimmung",
          "awaiting-other": "Wartet auf die Zustimmung von {{fullName}}",
        },
        actions: {
          trigger: { tooltip: "Aktionen anzeigen" },
          accept: "Akzeptieren",
          delete: "Löschen",
        },
      },
      toasts: {
        accepted: {
          title: "Freundschaft akzeptiert.",
          description: "{{fullName}} ist jetzt dein Freund.",
        },
        deleted: {
          title: "Freundschaft gelöscht.",
          description: {
            accepted: "{{fullName}} ist nicht mehr dein Freund.",
            "awaiting-me":
              "Die Freundschaftsanfrage von {{fullName}} wurde abgelehnt.",
            "awaiting-other":
              "Die Freundschaftsanfrage an {{fullName}} wurde entfernt.",
          },
        },
      },
    },
    chats: {
      "no-chats":
        "Noch keine Unterhaltungen. Starte einen Chat und verbinde dich mit anderen!",
      "no-chat-selected": {
        title: "Kein Chat ausgewählt.",
        description: "Wähle einen bestehenden Chat im Menü oder",
        action: "Erstelle einen neuen Chat",
      },
      "chat-unavailable": {
        title: "Chat nicht verfügbar.",
        description:
          "Der ausgewählte Chat existiert nicht oder ist für dich nicht verfügbar.",
        action: "Schließen",
      },
      navigation: {
        title: "Chatte mit anderen",
        items: {
          tooltip: "Chat öffnen",
          "only-file-text": "{{fullName}} hat {{count}} Datei(en) gesendet.",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "Chat erstellen" },
        dialog: {
          title: "Neuen Chat erstellen",
          description:
            "Suche und lade andere Benutzer zu deinem neu erstellten Chat ein. Klicke auf den Benutzer, um ihn in den Chat einzuladen.",
        },
        tabs: {
          private: "Privat",
          group: "Gruppe",
        },
        private: {
          form: {
            input: {
              placeholder: "Nach Personen suchen...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "Chat-Anzeigename (optional)" },
              search: { placeholder: "Nach Personen suchen..." },
            },
          },
        },
        "invited-users": " Eingeladene Personen",
        submit: "Chat erstellen",
      },
      form: {
        inputs: {
          text: { placeholder: "Tippen..." },
          file: { tooltip: "Datei anhängen", remove: "Datei entfernen" },
        },
        submit: { tooltip: "Nachricht senden" },
        reply: {
          author: { me: "Antwort an mich", other: "Antwort an {{name}}" },
          "only-files": "{{count}} Datei(en) gesendet.",
          cancel: { tooltip: "Abbrechen" },
        },
      },
      "income-message": {
        text: "{{name}}: {{text}}",
        "only-files": "{{name}} hat {{count}} Datei(en) gesendet.",
      },
      "date-seperator": {
        locale: "de-DE",
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
          mine: "{{date}} von dir",
          foreign: "{{date}} von {{name}}",
        },
        controls: {
          reply: { tooltip: "Antworten" },
          reaction: {
            trigger: { tooltip: "Reaktion erstellen" },
            title: "Erstelle deine Reaktion",
            "already-reacted":
              "Du hast bereits eine Reaktion für diese Nachricht erstellt.",
            "not-available": "Reagieren ist momentan nicht verfügbar.",
            values: {
              happy: "glücklich",
              sad: "traurig",
              crying: "weinend",
              heart: "Herz",
              skull: "Totenkopf",
            },
          },
        },
        reply: {
          "only-files": "{{name}} hat {{count}} Datei(en) gesendet.",
          text: {
            "you-to-you": "Du hast dir selbst geantwortet.",
            "you-to-other": "Du hast {{name}} geantwortet.",
            "other-to-you": "{{name}} hat dir geantwortet.",
            "other-to-other": "{{name1}} hat {{name2}} geantwortet.",
            "other-to-same": "{{name}} hat sich selbst geantwortet.",
          },
        },
      },
      leave: {
        trigger: { tooltip: "Chat verlassen" },
        dialog: {
          title: "Chat verlassen",
          description:
            "Bist du sicher, dass du diesen Chat verlassen möchtest? Wenn du gehst, hast du keinen Zugriff mehr auf die laufende Unterhaltung. Bitte bestätige deine Entscheidung unten.",
          cancel: "Abbrechen",
          confirm: "Verlassen",
        },
      },
      "user-activity": {
        online: "Online",
        offline: "Offline",
        "time-units": {
          min: "Min",
          hr: "Std",
        },
      },
      close: {
        tooltip: "Chat schließen",
      },
      settings: {
        trigger: { tooltip: "Einstellungen" },
        title: "Einstellungen",
        description: {
          private:
            "Verwalte die Mitglieder dieses Chats, indem du siehst, wer aktuell an der Unterhaltung teilnimmt. Du kannst ihre Aliase nach Bedarf aktualisieren oder entfernen.",
          group:
            "Verwalte die Mitglieder dieses Chats, indem du siehst, wer aktuell an der Unterhaltung teilnimmt. Du kannst ihre Aliase nach Bedarf aktualisieren oder entfernen. Außerdem kannst du neue Benutzer einladen, dem Chat beizutreten.",
        },
        users: {
          actions: {
            "send-message": { tooltip: "Nachricht senden" },
            "update-alias": { tooltip: "Alias aktualisieren" },
          },
        },
        "update-alias-dialog": {
          title: "Alias für {{name}} aktualisieren",
          description:
            "Du kannst den Alias für diesen Benutzer aktualisieren. Dieser Alias wird anstelle des vollständigen Namens im Chat angezeigt. Bitte bestätige den neuen Alias unten. Lass es leer, um den Alias zu entfernen.",
          cancel: "Abbrechen",
          confirm: "Speichern",
          input: { placeholder: "Alias erstellen" },
          "no-alias": "(Kein Alias)",
        },
        group: {
          tabs: {
            general: "Allgemein",
            members: "Mitglieder",
            invite: "Einladen",
          },
          info: {
            input: {
              name: { placeholder: "Gruppenname..." },
              file: { remove: "Entfernen" },
            },
            submit: "Speichern",
          },
          invite: {
            search: { placeholder: "Nach Personen suchen..." },
            empty: "Schreibe, um nach Benutzern zu suchen.",
            "no-result": "Keine Benutzer gefunden.",
            trigger: { tooltip: "{{name}} zu diesem Chat einladen" },
            dialog: {
              title: "{{name}} zu diesem Chat einladen",
              description:
                "Bist du sicher, dass du {{name}} zu diesem Chat einladen möchtest? Einmal eingeladen, kann die Person die Unterhaltung sehen und daran teilnehmen. Bestätige deine Aktion unten.",
              cancel: "Abbrechen",
              confirm: "Einladen",
            },
          },
        },
      },
    },
  },
};

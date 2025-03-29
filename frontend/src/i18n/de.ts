import { Translation } from "./types";

export const de: { translation: Translation } = {
  translation: {
    login: {
      error: {
        toast: {
          title: "Anmeldung nicht möglich.",
        },
      },
      greeting: "Willkommen bei",
      slogan:
        "Tauche ein in ein soziales Netzwerk, in dem du mit Freunden in Kontakt bleibst, deine Momente teilst und neue Gemeinschaften entdeckst – alles nur einen Klick entfernt.",
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
        "Beginne noch heute deine Reise und entdecke eine Welt voller Verbindungen und Möglichkeiten.",
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
          toast: {
            title: "Neues Konto kann nicht erstellt werden.",
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
        title: "Thema",
        description:
          "Wechsle zwischen hellem und dunklem Thema nach deinen Vorlieben.",
      },
      tooltips: {
        title: "Tooltips",
        description:
          "Aktiviere oder deaktiviere Tooltips für zusätzliche Anleitungen in der App.",
      },
      slogan:
        "Passe deine Einstellungen an, um Link Up wirklich zu deinem zu machen. Schalte Themen um, ändere Vorlieben und gestalte die Art und Weise, wie du mit der Plattform interagierst.",
      header: {
        1: "Personalisiere",
        2: "Dein Erlebnis",
      },
      form: {
        submit: {
          idle: "Aktualisieren",
          pending: "Wird aktualisiert...",
        },
        error: {
          toast: {
            title: "Einstellungen können nicht geändert werden.",
          },
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
                  "Bist du sicher, dass du dich abmelden möchtest? Dies beendet deine Sitzung, und du musst dich erneut anmelden, um auf dein Konto zuzugreifen.",
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
                  "Freundschaftsanfrage wurde an {{fullName}} gesendet.",
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
        years: "Vor {{count}} Jahren",
        months: "Vor {{count}} Monaten",
        weeks: "Vor {{count}} Wochen",
        days: "Vor {{count}} Tagen",
        hours: "Vor {{count}} Stunden",
        minutes: "Vor {{count}} Minuten",
        now: "Gerade eben",
        ago: "vorher",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Hier ist noch nichts",
          description:
            "Starte die Konversation! Teile deine Gedanken, indem du den ersten Beitrag erstellst.",
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
            "Bist du sicher, dass du diesen Beitrag löschen möchtest? Dies löscht deinen Beitrag, seine Kommentare und alle damit verbundenen Dateien.",
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
          toasts: {
            success: { title: "Kommentar erfolgreich gesendet." },
            error: { title: "Nachricht kann nicht gesendet werden." },
          },
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
        description: "Suche nach Personen mit der",
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
            "awaiting-me": "Freundschaftsanfrage von {{fullName}} abgelehnt.",
            "awaiting-other": "Freundschaftsanfrage an {{fullName}} entfernt.",
          },
        },
      },
    },
    chats: {
      sockets: {
        errors: {
          connection: {
            toast: {
              title: "Chatraum kann nicht beigetreten werden.",
              description:
                "Du kannst keine in Echtzeit gesendeten Nachrichten sehen. Versuche, die Seite neu zu laden.",
            },
          },
        },
      },
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
            "Suche und lade andere Benutzer in deinen neu erstellten Chat ein. Klicke auf den Benutzer, um ihn in den Chat einzuladen.",
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
          error: {
            toast: { title: "Neuer Gruppenchat kann nicht erstellt werden." },
          },
        },
        "invited-users": "Eingeladene Personen",
        submit: "Chat erstellen",
      },
      form: {
        error: {
          toast: {
            title: "Nachricht kann nicht gesendet werden.",
          },
        },
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
            "not-available": "Reagieren ist derzeit nicht verfügbar.",
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
            "Bist du sicher, dass du diesen Chat verlassen möchtest? Wenn du gehst, hast du keinen Zugriff mehr auf die laufende Unterhaltung. Wenn du sicher bist, bestätige dies bitte unten.",
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
            "Verwalte die Mitglieder dieses Chats, indem du siehst, wer aktuell an der Unterhaltung teilnimmt. Du kannst ihre Aliase nach Bedarf aktualisieren oder entfernen. Außerdem hast du die Möglichkeit, neue Benutzer in den Chat einzuladen.",
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
            "Du kannst den Alias für diesen Benutzer aktualisieren. Dieser Alias wird anstelle seines vollständigen Namens im Chat angezeigt. Bitte bestätige den neuen Alias unten. Lass es leer, um den Alias zu entfernen.",
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
            trigger: { tooltip: "{{name}} in diesen Chat einladen" },
            dialog: {
              title: "{{name}} in diesen Chat einladen",
              description:
                "Bist du sicher, dass du {{name}} in diesen Chat einladen möchtest? Einmal eingeladen, können sie die Unterhaltung sehen und daran teilnehmen. Bestätige deine Aktion unten.",
              cancel: "Abbrechen",
              confirm: "Einladen",
            },
          },
        },
      },
    },
    editor: {
      toasts: {
        "created-successfully": {
          title: "Beitrag erfolgreich erstellt.",
        },
        "updated-successfully": {
          title: "Beitrag erfolgreich aktualisiert.",
        },
        "create-error": {
          title: "Beitrag kann nicht erstellt werden.",
        },
        "update-error": {
          title: "Beitrag kann nicht aktualisiert werden.",
        },
      },
      "file-dialog": {
        title: "Dateien durchsuchen",
        description:
          "Kopiere URLs von Dateien aus deinem Cache, um sie in deinen Beitrag einzufügen.",
        "cache-empty": "Keine Dateien im Cache.",
        "used-files": "Verwendete Dateien",
        "file-upload": { tooltip: "Datei hochladen" },
        cache: "Cache",
        item: {
          "copy-to-clipboard": {
            tooltip: "Element kopieren",
            toast: "Element in die Zwischenablage kopiert.",
          },
          remove: {
            trigger: { tooltip: "Datei entfernen" },
            dialog: {
              title: "Bist du absolut sicher?",
              description:
                "Diese Aktion kann nicht rückgängig gemacht werden. Dies löscht deine Datei dauerhaft von unseren Servern.",
              cancel: "Abbrechen",
              confirm: "Fortfahren",
            },
          },
        },
      },
    },
  },
};

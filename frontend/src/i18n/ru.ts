import { Translation } from "./types";

export const ru: { translation: Translation } = {
  translation: {
    login: {
      greeting: "Добро пожаловать в",
      slogan:
        "Погрузитесь в социальную сеть, где общение с друзьями, обмен моментами и открытие новых сообществ находятся всего в одном клике.",
      form: {
        placeholders: {
          login: "Логин",
          password: "Пароль",
        },
        submit: {
          idle: "Войти",
          pending: "Вход...",
        },
        errors: {
          login: {
            min: "Логин должен содержать не менее 5 символов.",
            max: "Логин не должен превышать 50 символов.",
          },
          password: {
            min: "Пароль должен содержать не менее 5 символов.",
          },
        },
      },
      "no-account": "Нет аккаунта?",
      "sign-in-redirect": "Зарегистрироваться",
    },
    signup: {
      header: {
        1: "Присоединяйтесь к",
        2: "Сети",
      },
      slogan:
        "Начните свое путешествие сегодня и откройте мир связей и возможностей.",
      form: {
        placeholders: {
          firstname: "Имя",
          lastname: "Фамилия",
          login: "Логин",
          password: "Пароль",
          "confirm-password": "Подтвердите пароль",
        },
        errors: {
          firstname: {
            min: "Имя не может быть пустым.",
            max: "Имя не должно превышать 50 символов.",
          },
          lastname: {
            min: "Фамилия не может быть пустой.",
            max: "Фамилия не должна превышать 50 символов.",
          },
          login: {
            min: "Логин должен содержать не менее 5 символов.",
            max: "Логин не должен превышать 50 символов.",
          },
          password: {
            min: "Пароль должен содержать не менее 5 символов.",
            mismatch: "Пароли не совпадают.",
          },
        },
        "remove-image": "Удалить",
        submit: {
          idle: "Зарегистрироваться",
          pending: "Регистрация...",
        },
      },
      "already-have-account": "Уже есть аккаунт?",
      "login-redirect": "Войти",
    },
    settings: {
      language: {
        title: "Язык",
        description: "Выберите предпочитаемый язык интерфейса.",
      },
      theme: {
        title: "Тема",
        description:
          "Переключайтесь между светлой и темной темами по вашему вкусу.",
      },
      tooltips: {
        title: "Подсказки",
        description:
          "Включите или отключите подсказки для дополнительной помощи в приложении.",
      },
      slogan:
        "Настройте параметры, чтобы сделать Link Up по-настоящему вашим. Переключайте темы, изменяйте предпочтения и определяйте, как вы взаимодействуете с платформой.",
      header: {
        1: "Персонализируйте",
        2: "Ваш опыт",
      },
      form: {
        submit: {
          idle: "Обновить",
          pending: "Обновление...",
        },
      },
    },
    common: {
      you: "Вы",
      loading: "Подождите, мы готовим приложение...",
      navbar: {
        sheet: {
          trigger: { tooltip: "Показать действия" },
          title: {
            "logged-in": "Добро пожаловать, {{fullName}}!",
            anonymous: "Добро пожаловать!",
          },
          items: {
            home: "Главная",
            chats: "Чаты",
            settings: "Настройки",
            posts: "Посты",
            friends: "Друзья",
            login: "Войти",
            signup: "Создать новый аккаунт",
            logout: {
              trigger: "Выйти",
              dialog: {
                title: "Вы абсолютно уверены?",
                description:
                  "Вы уверены, что хотите выйти? Это завершит вашу сессию, и вам придется снова войти, чтобы получить доступ к аккаунту.",
                cancel: "Отмена",
                confirm: "Да, выйти",
              },
            },
          },
        },
        logo: {
          tooltip: "Главная",
        },
        search: {
          placeholder: "Поиск в Link Up...",
          "no-users": "Пользователи не найдены.",
          tooltip: "Поиск пользователей",
          heading: "Результат поиска",
          message: {
            button: {
              tooltip: "Отправить сообщение",
            },
          },
          friendships: {
            button: {
              tooltip: "Добавить друга",
            },
            toasts: {
              "already-exists": {
                title: "Запрос дружбы уже существует.",
                description: "Между вами и {{fullName}} уже есть дружба.",
                action: "Показать друзей",
              },
              "successfully-created": {
                title: "Запрос дружбы отправлен.",
                description: "Запрос дружбы отправлен {{fullName}}.",
                action: "Показать друзей",
              },
            },
          },
        },
      },
      theme: {
        light: "светлая",
        dark: "темная",
        switch: {
          tooltip: "Переключить на {{mode}} режим",
        },
      },
      time: {
        years: "{{count}} лет назад",
        months: "{{count}} месяцев назад",
        weeks: "{{count}} недель назад",
        days: "{{count}} дней назад",
        hours: "{{count}} часов назад",
        minutes: "{{count}} минут назад",
        now: "Только что",
        ago: "назад",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Здесь пока ничего нет",
          description:
            "Начните разговор! Поделитесь своими мыслями, создав первый пост.",
          action: "Написать пост",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Показать больше",
        "show-less": "Скрыть",
      },
      new: { button: "Создать новый пост" },
      edit: {
        button: { tooltip: "Редактировать" },
      },
      delete: {
        button: { tooltip: "Удалить" },
        dialog: {
          title: "Вы абсолютно уверены?",
          description:
            "Вы уверены, что хотите удалить этот пост? Это удалит ваш пост, его комментарии и все связанные файлы.",
          cancel: "Отмена",
          confirm: "Да, удалить",
        },
      },
      comments: {
        section: {
          open: "Открыть комментарии",
          close: "Закрыть комментарии",
        },
        tooltip: {
          you: "Вы",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "ru-RU",
        },
        buttons: {
          reply: { tooltip: "Ответить" },
          extend: { tooltip: "Показать ответы" },
          reduce: { tooltip: "Скрыть ответы" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "Оставьте ваш комментарий...",
            },
            file: { tooltip: "Прикрепить файл", remove: "Удалить файл" },
          },
          submit: { tooltip: "Отправить комментарий" },
          reply: {
            to: {
              me: "Ответ себе.",
              other: "Ответ {{fullName}}.",
            },
            remove: { tooltip: "Удалить ответ" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "Фильтр пользователей..." },
        statuses: {
          input: {
            placeholder: "Фильтр пользователей...",
            all: "Все",
            accepted: "Принято",
            "awaiting-me": "Ожидает меня",
            "awaiting-other": "Ожидает другого",
          },
          all: "Все ({{count}})",
          accepted: "Принято ({{count}})",
          "awaiting-me": "Ожидает меня ({{count}})",
          "awaiting-other": "Ожидает другого ({{count}})",
        },
      },
      column: {
        user: { title: "Пользователь" },
        status: { title: "Статус" },
      },
      "no-result": {
        title: "Нет результатов.",
        description: "Ищите людей через",
        link: { text: "панель навигации" },
      },
      cells: {
        statuses: {
          accepted: "Друзья",
          "awaiting-me": "Ожидает вашего подтверждения",
          "awaiting-other": "Ожидает подтверждения {{fullName}}",
        },
        actions: {
          trigger: { tooltip: "Показать действия" },
          accept: "Принять",
          delete: "Удалить",
        },
      },
      toasts: {
        accepted: {
          title: "Дружба принята.",
          description: "{{fullName}} теперь ваш друг.",
        },
        deleted: {
          title: "Дружба удалена.",
          description: {
            accepted: "{{fullName}} больше не ваш друг.",
            "awaiting-me": "Запрос дружбы от {{fullName}} отклонен.",
            "awaiting-other": "Запрос дружбы к {{fullName}} удален.",
          },
        },
      },
    },
    chats: {
      "no-chats": "Пока нет разговоров. Начните чат и свяжитесь с другими!",
      "no-chat-selected": {
        title: "Чат не выбран.",
        description: "Выберите существующий чат в меню или",
        action: "Создать новый чат",
      },
      "chat-unavailable": {
        title: "Чат недоступен.",
        description: "Выбранный чат не существует или недоступен для вас.",
        action: "Закрыть",
      },
      navigation: {
        title: "Общайтесь с другими",
        items: {
          tooltip: "Открыть чат",
          "only-file-text": "{{fullName}} отправил {{count}} файл(ов).",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "Создать чат" },
        dialog: {
          title: "Создать новый чат",
          description:
            "Ищите и приглашайте других пользователей в ваш новый чат. Нажмите на пользователя, чтобы пригласить его в чат.",
        },
        tabs: {
          private: "Личный",
          group: "Группа",
        },
        private: {
          form: {
            input: {
              placeholder: "Поиск людей...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "Отображаемое имя чата (опционально)" },
              search: { placeholder: "Поиск людей..." },
            },
          },
        },
        "invited-users": "Приглашенные пользователи",
        submit: "Создать чат",
      },
      form: {
        inputs: {
          text: { placeholder: "Введите..." },
          file: { tooltip: "Прикрепить файл", remove: "Удалить файл" },
        },
        submit: { tooltip: "Отправить сообщение" },
        reply: {
          author: { me: "Ответ себе", other: "Ответ {{name}}" },
          "only-files": "Отправлено {{count}} файл(ов).",
          cancel: { tooltip: "Отмена" },
        },
      },
      "income-message": {
        text: "{{name}}: {{text}}",
        "only-files": "{{name}} отправил {{count}} файл(ов).",
      },
      "date-seperator": {
        locale: "ru-RU",
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
          mine: "{{date}} от вас",
          foreign: "{{date}} от {{name}}",
        },
        controls: {
          reply: { tooltip: "Ответить" },
          reaction: {
            trigger: { tooltip: "Создать реакцию" },
            title: "Создайте свою реакцию",
            "already-reacted": "Вы уже создали реакцию на это сообщение.",
            "not-available": "Реакции сейчас недоступны.",
            values: {
              happy: "счастливый",
              sad: "грустный",
              crying: "плачущий",
              heart: "сердце",
              skull: "череп",
            },
          },
        },
        reply: {
          "only-files": "{{name}} отправил {{count}} файл(ов).",
          text: {
            "you-to-you": "Вы ответили себе.",
            "you-to-other": "Вы ответили {{name}}.",
            "other-to-you": "{{name}} ответил вам.",
            "other-to-other": "{{name1}} ответил {{name2}}.",
            "other-to-same": "{{name}} ответил себе.",
          },
        },
      },
      leave: {
        trigger: { tooltip: "Покинуть чат" },
        dialog: {
          title: "Покинуть чат",
          description:
            "Вы уверены, что хотите покинуть этот чат? После ухода вы больше не сможете участвовать в текущем разговоре. Подтвердите свое решение ниже.",
          cancel: "Отмена",
          confirm: "Покинуть",
        },
      },
      "user-activity": {
        online: "Онлайн",
        offline: "Офлайн",
        "time-units": {
          min: "мин",
          hr: "ч",
        },
      },
      close: {
        tooltip: "Закрыть чат",
      },
      settings: {
        trigger: { tooltip: "Настройки" },
        title: "Настройки",
        description: {
          private:
            "Управляйте участниками этого чата, просматривая, кто сейчас участвует в разговоре. Вы можете обновлять или удалять их псевдонимы по необходимости.",
          group:
            "Управляйте участниками этого чата, просматривая, кто сейчас участвует в разговоре. Вы можете обновлять или удалять их псевдонимы по необходимости. Также вы можете пригласить новых пользователей в чат.",
        },
        users: {
          actions: {
            "send-message": { tooltip: "Отправить сообщение" },
            "update-alias": { tooltip: "Обновить псевдоним" },
          },
        },
        "update-alias-dialog": {
          title: "Обновить псевдоним для {{name}}",
          description:
            "Вы можете обновить псевдоним для этого пользователя. Этот псевдоним будет отображаться вместо полного имени в чате. Подтвердите новый псевдоним ниже. Оставьте поле пустым, чтобы удалить псевдоним.",
          cancel: "Отмена",
          confirm: "Сохранить",
          input: { placeholder: "Создать псевдоним" },
          "no-alias": "(Нет псевдонима)",
        },
        group: {
          tabs: {
            general: "Общие",
            members: "Участники",
            invite: "Пригласить",
          },
          info: {
            input: {
              name: { placeholder: "Название группы..." },
              file: { remove: "Удалить" },
            },
            submit: "Сохранить",
          },
          invite: {
            search: { placeholder: "Поиск людей..." },
            empty: "Введите запрос для поиска пользователей.",
            "no-result": "Пользователи не найдены.",
            trigger: { tooltip: "Пригласить {{name}} в этот чат" },
            dialog: {
              title: "Пригласить {{name}} в этот чат",
              description:
                "Вы уверены, что хотите пригласить {{name}} в этот чат? После приглашения они смогут просматривать и участвовать в разговоре. Подтвердите свое действие ниже.",
              cancel: "Отмена",
              confirm: "Пригласить",
            },
          },
        },
      },
    },
  },
};

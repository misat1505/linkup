import { Translation } from "./types";

export const ru: { translation: Translation } = {
  translation: {
    login: {
      error: {
        toast: {
          title: "Не удалось войти.",
        },
      },
      greeting: "Добро пожаловать в",
      slogan:
        "Погрузись в социальную сеть, где общение с друзьями, обмен моментами и открытие новых сообществ находятся всего в одном клике.",
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
            max: "Логин должен содержать не более 50 символов.",
          },
          password: {
            min: "Пароль должен содержать не менее 5 символов.",
          },
        },
      },
      "no-account": "Нет аккаунта?",
      "sign-in-redirect": "Регистрация",
    },
    signup: {
      header: {
        1: "Присоединяйся к",
        2: "Сети",
      },
      slogan:
        "Начни свое путешествие сегодня и открой мир связей и возможностей.",
      form: {
        placeholders: {
          firstname: "Имя",
          lastname: "Фамилия",
          login: "Логин",
          password: "Пароль",
          "confirm-password": "Подтвердить пароль",
        },
        errors: {
          firstname: {
            min: "Имя не может быть пустым.",
            max: "Имя должно содержать не более 50 символов.",
          },
          lastname: {
            min: "Фамилия не может быть пустой.",
            max: "Фамилия должна содержать не более 50 символов.",
          },
          login: {
            min: "Логин должен содержать не менее 5 символов.",
            max: "Логин должен содержать не более 50 символов.",
          },
          password: {
            min: "Пароль должен содержать не менее 5 символов.",
            mismatch: "Пароли не совпадают.",
          },
          toast: {
            title: "Не удалось создать новый аккаунт.",
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
        description: "Выбери предпочитаемый язык интерфейса.",
      },
      theme: {
        title: "Тема",
        description:
          "Переключайся между светлой и темной темами по своему вкусу.",
      },
      tooltips: {
        title: "Подсказки",
        description:
          "Включи или отключи подсказки для дополнительной помощи в приложении.",
      },
      slogan:
        "Настрой свои параметры, чтобы сделать Link Up по-настоящему своим. Переключай темы, изменяй предпочтения и определяй, как взаимодействовать с платформой.",
      header: {
        1: "Персонализируй",
        2: "Свой опыт",
      },
      form: {
        submit: {
          idle: "Обновить",
          pending: "Обновление...",
        },
        error: {
          toast: {
            title: "Не удалось изменить настройки.",
          },
        },
      },
    },
    common: {
      you: "Ты",
      loading: "Подожди, пока мы готовим приложение...",
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
            posts: "Публикации",
            friends: "Друзья",
            login: "Войти",
            signup: "Создать новый аккаунт",
            logout: {
              trigger: "Выйти",
              dialog: {
                title: "Ты абсолютно уверен?",
                description:
                  "Ты уверен, что хочешь выйти? Это завершит твою сессию, и тебе придется снова войти, чтобы получить доступ к аккаунту.",
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
                description: "Между тобой и {{fullName}} уже есть дружба.",
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
            "Начни разговор! Поделись своими мыслями, создав первую публикацию.",
          action: "Написать публикацию",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Показать больше",
        "show-less": "Показать меньше",
      },
      new: { button: "Создать новую публикацию" },
      edit: {
        button: { tooltip: "Редактировать" },
      },
      delete: {
        button: { tooltip: "Удалить" },
        dialog: {
          title: "Ты абсолютно уверен?",
          description:
            "Ты уверен, что хочешь удалить эту публикацию? Это удалит твою публикацию, ее комментарии и все связанные файлы.",
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
          you: "Ты",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "ru-RU",
        },
        buttons: {
          reply: { tooltip: "Ответить" },
          extend: { tooltip: "Показать ответы" },
          reduce: { tooltip: "Закрыть ответы" },
        },
        form: {
          toasts: {
            success: { title: "Комментарий успешно отправлен." },
            error: { title: "Не удалось отправить сообщение." },
          },
          inputs: {
            text: {
              placeholder: "Оставь свой комментарий...",
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
        input: { placeholder: "Фильтровать пользователей..." },
        statuses: {
          input: {
            placeholder: "Фильтровать пользователей...",
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
        description: "Ищи людей через",
        link: { text: "панель навигации" },
      },
      cells: {
        statuses: {
          accepted: "Друзья",
          "awaiting-me": "Ожидает твоего подтверждения",
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
          description: "{{fullName}} теперь твой друг.",
        },
        deleted: {
          title: "Дружба удалена.",
          description: {
            accepted: "{{fullName}} больше не твой друг.",
            "awaiting-me": "Запрос дружбы от {{fullName}} отклонен.",
            "awaiting-other": "Запрос дружбы к {{fullName}} удален.",
          },
        },
      },
    },
    chats: {
      sockets: {
        errors: {
          connection: {
            toast: {
              title: "Не удалось подключиться к чату.",
              description:
                "Ты не сможешь видеть сообщения, отправленные в реальном времени. Попробуй перезагрузить страницу.",
            },
          },
        },
      },
      "no-chats": "Пока нет бесед. Начни чат и общайся с другими!",
      "no-chat-selected": {
        title: "Чат не выбран.",
        description: "Выбери существующий чат в меню или",
        action: "Создай новый чат",
      },
      "chat-unavailable": {
        title: "Чат недоступен.",
        description: "Выбранный чат не существует или недоступен для тебя.",
        action: "Закрыть",
      },
      navigation: {
        title: "Общайся с другими",
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
            "Ищи и приглашай других пользователей в свой новый чат. Нажми на пользователя, чтобы пригласить его в чат.",
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
              name: { placeholder: "Название чата (опционально)" },
              search: { placeholder: "Поиск людей..." },
            },
          },
          error: {
            toast: { title: "Не удалось создать новый групповой чат." },
          },
        },
        "invited-users": "Приглашенные люди",
        submit: "Создать чат",
      },
      form: {
        error: {
          toast: {
            title: "Не удалось отправить сообщение.",
          },
        },
        inputs: {
          text: { placeholder: "Пиши..." },
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
          mine: "{{date}} от тебя",
          foreign: "{{date}} от {{name}}",
        },
        controls: {
          reply: { tooltip: "Ответить" },
          reaction: {
            trigger: { tooltip: "Создать реакцию" },
            title: "Создай свою реакцию",
            "already-reacted": "Ты уже создал реакцию на это сообщение.",
            "not-available": "Реакции сейчас недоступны.",
            values: {
              happy: "счастлив",
              sad: "грустно",
              crying: "плачу",
              heart: "сердце",
              skull: "череп",
            },
          },
        },
        reply: {
          "only-files": "{{name}} отправил {{count}} файл(ов).",
          text: {
            "you-to-you": "Ты ответил себе.",
            "you-to-other": "Ты ответил {{name}}.",
            "other-to-you": "{{name}} ответил тебе.",
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
            "Ты уверен, что хочешь покинуть этот чат? После выхода ты больше не сможешь видеть текущую беседу. Если уверен, подтверди ниже.",
          cancel: "Отмена",
          confirm: "Покинуть",
        },
      },
      "user-activity": {
        online: "Онлайн",
        offline: "Оффлайн",
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
            "Управляй участниками этого чата, просматривая, кто сейчас участвует в беседе. Ты можешь обновить или удалить их псевдонимы по необходимости.",
          group:
            "Управляй участниками этого чата, просматривая, кто сейчас участвует в беседе. Ты можешь обновить или удалить их псевдонимы по необходимости. Также есть возможность пригласить новых пользователей в чат.",
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
            "Ты можешь обновить псевдоним этого пользователя. Этот псевдоним будет отображаться вместо его полного имени в чате. Подтверди новый псевдоним ниже. Оставь поле пустым, чтобы удалить псевдоним.",
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
            empty: "Напиши, чтобы найти пользователей.",
            "no-result": "Пользователи не найдены.",
            trigger: { tooltip: "Пригласить {{name}} в этот чат" },
            dialog: {
              title: "Пригласить {{name}} в этот чат",
              description:
                "Ты уверен, что хочешь пригласить {{name}} в этот чат? После приглашения он сможет видеть и участвовать в беседе. Подтверди свое действие ниже.",
              cancel: "Отмена",
              confirm: "Пригласить",
            },
          },
        },
      },
    },
    editor: {
      toasts: {
        "created-successfully": {
          title: "Публикация успешно создана.",
        },
        "updated-successfully": {
          title: "Публикация успешно обновлена.",
        },
        "create-error": {
          title: "Не удалось создать публикацию.",
        },
        "update-error": {
          title: "Не удалось обновить публикацию.",
        },
      },
      "file-dialog": {
        title: "Обзор файлов",
        description:
          "Скопируй URL-адреса файлов из кэша, чтобы добавить их в свою публикацию.",
        "cache-empty": "В кэше нет файлов.",
        "used-files": "Использованные файлы",
        "file-upload": { tooltip: "Загрузить файл" },
        cache: "Кэш",
        item: {
          "copy-to-clipboard": {
            tooltip: "Скопировать элемент",
            toast: "Элемент скопирован в буфер обмена.",
          },
          remove: {
            trigger: { tooltip: "Удалить файл" },
            dialog: {
              title: "Ты абсолютно уверен?",
              description:
                "Это действие нельзя отменить. Это навсегда удалит твой файл с наших серверов.",
              cancel: "Отмена",
              confirm: "Продолжить",
            },
          },
        },
      },
    },
  },
};

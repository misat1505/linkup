import { Translation } from "./types";

export const es: { translation: Translation } = {
  translation: {
    login: {
      greeting: "Bienvenido a",
      slogan:
        "Sumérgete en una red social donde conectar con amigos, compartir tus momentos y descubrir nuevas comunidades está a solo un clic.",
      form: {
        placeholders: {
          login: "Usuario",
          password: "Contraseña",
        },
        submit: {
          idle: "Iniciar sesión",
          pending: "Iniciando sesión...",
        },
        errors: {
          login: {
            min: "El usuario debe tener al menos 5 caracteres.",
            max: "El usuario no debe exceder los 50 caracteres.",
          },
          password: {
            min: "La contraseña debe tener al menos 5 caracteres.",
          },
        },
      },
      "no-account": "¿No tienes cuenta?",
      "sign-in-redirect": "Registrarse",
    },
    signup: {
      header: {
        1: "Únete a la",
        2: "Red",
      },
      slogan:
        "Comienza tu viaje hoy y descubre un mundo de conexiones y oportunidades.",
      form: {
        placeholders: {
          firstname: "Nombre",
          lastname: "Apellido",
          login: "Usuario",
          password: "Contraseña",
          "confirm-password": "Confirmar contraseña",
        },
        errors: {
          firstname: {
            min: "El nombre no puede estar vacío.",
            max: "El nombre no debe exceder los 50 caracteres.",
          },
          lastname: {
            min: "El apellido no puede estar vacío.",
            max: "El apellido no debe exceder los 50 caracteres.",
          },
          login: {
            min: "El usuario debe tener al menos 5 caracteres.",
            max: "El usuario no debe exceder los 50 caracteres.",
          },
          password: {
            min: "La contraseña debe tener al menos 5 caracteres.",
            mismatch: "Las contraseñas no coinciden.",
          },
        },
        "remove-image": "Eliminar",
        submit: {
          idle: "Registrarse",
          pending: "Registrando...",
        },
      },
      "already-have-account": "¿Ya tienes cuenta?",
      "login-redirect": "Iniciar sesión",
    },
    settings: {
      language: {
        title: "Idioma",
        description: "Elige tu idioma preferido para la interfaz.",
      },
      theme: {
        title: "Tema",
        description:
          "Cambia entre temas claro y oscuro según tus preferencias.",
      },
      tooltips: {
        title: "Consejos",
        description:
          "Activa o desactiva los consejos para orientación adicional en la aplicación.",
      },
      slogan:
        "Personaliza tus ajustes para hacer de Link Up algo realmente tuyo. Cambia temas, ajusta preferencias y define cómo interactúas con la plataforma.",
      header: {
        1: "Personaliza",
        2: "Tu experiencia",
      },
      form: {
        submit: {
          idle: "Actualizar",
          pending: "Actualizando...",
        },
      },
    },
    common: {
      you: "Tú",
      loading: "Espera un momento mientras preparamos la aplicación...",
      navbar: {
        sheet: {
          trigger: { tooltip: "Mostrar acciones" },
          title: {
            "logged-in": "¡Bienvenido, {{fullName}}!",
            anonymous: "¡Bienvenido!",
          },
          items: {
            home: "Inicio",
            chats: "Chats",
            settings: "Ajustes",
            posts: "Publicaciones",
            friends: "Amigos",
            login: "Iniciar sesión",
            signup: "Crear nueva cuenta",
            logout: {
              trigger: "Cerrar sesión",
              dialog: {
                title: "¿Estás absolutamente seguro?",
                description:
                  "¿Seguro que quieres cerrar sesión? Esto finalizará tu sesión y necesitarás iniciar sesión nuevamente para acceder a tu cuenta.",
                cancel: "Cancelar",
                confirm: "Sí, cerrar sesión",
              },
            },
          },
        },
        logo: {
          tooltip: "Inicio",
        },
        search: {
          placeholder: "Buscar en Link Up...",
          "no-users": "No se encontraron usuarios.",
          tooltip: "Buscar usuarios",
          heading: "Resultado de búsqueda",
          message: {
            button: {
              tooltip: "Enviar mensaje",
            },
          },
          friendships: {
            button: {
              tooltip: "Agregar amigo",
            },
            toasts: {
              "already-exists": {
                title: "La solicitud de amistad ya existe.",
                description: "Ya existe una amistad entre tú y {{fullName}}.",
                action: "Ver amigos",
              },
              "successfully-created": {
                title: "Solicitud de amistad enviada.",
                description:
                  "La solicitud de amistad fue enviada a {{fullName}}.",
                action: "Ver amigos",
              },
            },
          },
        },
      },
      theme: {
        light: "claro",
        dark: "oscuro",
        switch: {
          tooltip: "Cambiar a modo {{mode}}",
        },
      },
      time: {
        years: "hace {{count}} años",
        months: "hace {{count}} meses",
        weeks: "hace {{count}} semanas",
        days: "hace {{count}} días",
        hours: "hace {{count}} horas",
        minutes: "hace {{count}} minutos",
        now: "Ahora mismo",
        ago: "hace",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Aún no hay nada aquí",
          description:
            "¡Comienza la conversación! Comparte tus pensamientos creando la primera publicación.",
          action: "Escribir una publicación",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Mostrar más",
        "show-less": "Mostrar menos",
      },
      new: { button: "Crear nueva publicación" },
      edit: {
        button: { tooltip: "Editar" },
      },
      delete: {
        button: { tooltip: "Eliminar" },
        dialog: {
          title: "¿Estás absolutamente seguro?",
          description:
            "¿Seguro que quieres eliminar esta publicación? Esto eliminará tu publicación, sus comentarios y todos los archivos relacionados.",
          cancel: "Cancelar",
          confirm: "Sí, eliminar",
        },
      },
      comments: {
        section: {
          open: "Abrir comentarios",
          close: "Cerrar comentarios",
        },
        tooltip: {
          you: "Tú",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "es-ES",
        },
        buttons: {
          reply: { tooltip: "Responder" },
          extend: { tooltip: "Mostrar respuestas" },
          reduce: { tooltip: "Ocultar respuestas" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "Deja tu comentario...",
            },
            file: { tooltip: "Adjuntar archivo", remove: "Eliminar archivo" },
          },
          submit: { tooltip: "Enviar comentario" },
          reply: {
            to: {
              me: "Respondiendo a ti mismo.",
              other: "Respondiendo a {{fullName}}.",
            },
            remove: { tooltip: "Eliminar respuesta" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "Filtrar usuarios..." },
        statuses: {
          input: {
            placeholder: "Filtrar usuarios...",
            all: "Todos",
            accepted: "Aceptados",
            "awaiting-me": "Esperando mi aprobación",
            "awaiting-other": "Esperando aprobación de otro",
          },
          all: "Todos ({{count}})",
          accepted: "Aceptados ({{count}})",
          "awaiting-me": "Esperando mi aprobación ({{count}})",
          "awaiting-other": "Esperando aprobación de otro ({{count}})",
        },
      },
      column: {
        user: { title: "Usuario" },
        status: { title: "Estado" },
      },
      "no-result": {
        title: "Sin resultados.",
        description: "Busca personas usando la",
        link: { text: "barra de navegación" },
      },
      cells: {
        statuses: {
          accepted: "Amigos",
          "awaiting-me": "Esperando tu aprobación",
          "awaiting-other": "Esperando la aprobación de {{fullName}}",
        },
        actions: {
          trigger: { tooltip: "Mostrar acciones" },
          accept: "Aceptar",
          delete: "Eliminar",
        },
      },
      toasts: {
        accepted: {
          title: "Amistad aceptada.",
          description: "{{fullName}} es ahora tu amigo.",
        },
        deleted: {
          title: "Amistad eliminada.",
          description: {
            accepted: "{{fullName}} ya no es tu amigo.",
            "awaiting-me":
              "La solicitud de amistad de {{fullName}} ha sido rechazada.",
            "awaiting-other":
              "La solicitud de amistad a {{fullName}} ha sido eliminada.",
          },
        },
      },
    },
    chats: {
      "no-chats":
        "Aún no hay conversaciones. ¡Inicia un chat y conecta con otros!",
      "no-chat-selected": {
        title: "No hay chat seleccionado.",
        description: "Selecciona un chat existente en el menú o",
        action: "Crea un nuevo chat",
      },
      "chat-unavailable": {
        title: "Chat no disponible.",
        description:
          "El chat seleccionado no existe o no está disponible para ti.",
        action: "Cerrar",
      },
      navigation: {
        title: "Chatea con otros",
        items: {
          tooltip: "Abrir chat",
          "only-file-text": "{{fullName}} envió {{count}} archivo(s).",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "Crear chat" },
        dialog: {
          title: "Crear nuevo chat",
          description:
            "Busca e invita a otros usuarios a tu nuevo chat. Haz clic en el usuario para invitarlo al chat.",
        },
        tabs: {
          private: "Privado",
          group: "Grupo",
        },
        private: {
          form: {
            input: {
              placeholder: "Buscar personas...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "Nombre del chat (opcional)" },
              search: { placeholder: "Buscar personas..." },
            },
          },
        },
        "invited-users": "Personas invitadas",
        submit: "Crear chat",
      },
      form: {
        inputs: {
          text: { placeholder: "Escribe..." },
          file: { tooltip: "Adjuntar archivo", remove: "Eliminar archivo" },
        },
        submit: { tooltip: "Enviar mensaje" },
        reply: {
          author: { me: "Respondiendo a mí", other: "Respondiendo a {{name}}" },
          "only-files": "Envió {{count}} archivo(s).",
          cancel: { tooltip: "Cancelar" },
        },
      },
      "income-message": {
        text: "{{name}}: {{text}}",
        "only-files": "{{name}} envió {{count}} archivo(s).",
      },
      "date-seperator": {
        locale: "es-ES",
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
          mine: "{{date}} por ti",
          foreign: "{{date}} por {{name}}",
        },
        controls: {
          reply: { tooltip: "Responder" },
          reaction: {
            trigger: { tooltip: "Crear reacción" },
            title: "Crea tu reacción",
            "already-reacted": "Ya has creado una reacción para este mensaje.",
            "not-available": "Reaccionar no está disponible en este momento.",
            values: {
              happy: "feliz",
              sad: "triste",
              crying: "llorando",
              heart: "corazón",
              skull: "calavera",
            },
          },
        },
        reply: {
          "only-files": "{{name}} envió {{count}} archivo(s).",
          text: {
            "you-to-you": "Te respondiste a ti mismo.",
            "you-to-other": "Respondiste a {{name}}.",
            "other-to-you": "{{name}} te respondió.",
            "other-to-other": "{{name1}} respondió a {{name2}}.",
            "other-to-same": "{{name}} se respondió a sí mismo.",
          },
        },
      },
      leave: {
        trigger: { tooltip: "Salir del chat" },
        dialog: {
          title: "Salir del chat",
          description:
            "¿Estás seguro de que quieres salir de este chat? Al salir, ya no tendrás acceso a la conversación en curso. Si estás seguro, confirma a continuación.",
          cancel: "Cancelar",
          confirm: "Salir",
        },
      },
      "user-activity": {
        online: "En línea",
        offline: "Fuera de línea",
        "time-units": {
          min: "min",
          hr: "h",
        },
      },
      close: {
        tooltip: "Cerrar chat",
      },
      settings: {
        trigger: { tooltip: "Ajustes" },
        title: "Ajustes",
        description: {
          private:
            "Gestiona los miembros de este chat viendo quién está participando actualmente en la conversación. Puedes actualizar o eliminar sus alias según sea necesario.",
          group:
            "Gestiona los miembros de este chat viendo quién está participando actualmente en la conversación. Puedes actualizar o eliminar sus alias según sea necesario. Además, tienes la opción de invitar a nuevos usuarios al chat.",
        },
        users: {
          actions: {
            "send-message": { tooltip: "Enviar mensaje" },
            "update-alias": { tooltip: "Actualizar alias" },
          },
        },
        "update-alias-dialog": {
          title: "Actualizar alias para {{name}}",
          description:
            "Puedes actualizar el alias de este usuario. Este alias se mostrará en lugar de su nombre completo en el chat. Confirma el nuevo alias a continuación. Déjalo en blanco para eliminar el alias.",
          cancel: "Cancelar",
          confirm: "Guardar",
          input: { placeholder: "Crear alias" },
          "no-alias": "(Sin alias)",
        },
        group: {
          tabs: {
            general: "General",
            members: "Miembros",
            invite: "Invitar",
          },
          info: {
            input: {
              name: { placeholder: "Nombre del grupo..." },
              file: { remove: "Eliminar" },
            },
            submit: "Guardar",
          },
          invite: {
            search: { placeholder: "Buscar personas..." },
            empty: "Escribe para buscar usuarios.",
            "no-result": "No se encontraron usuarios.",
            trigger: { tooltip: "Invitar a {{name}} a este chat" },
            dialog: {
              title: "Invitar a {{name}} a este chat",
              description:
                "¿Estás seguro de que quieres invitar a {{name}} a este chat? Una vez invitado, podrá ver y participar en la conversación. Confirma tu acción a continuación.",
              cancel: "Cancelar",
              confirm: "Invitar",
            },
          },
        },
      },
    },
  },
};

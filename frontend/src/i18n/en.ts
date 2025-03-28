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
    common: {
      you: "You",
      loading: "Hang tight as we prepare the app...",
      navbar: {
        sheet: {
          trigger: { tooltip: "Show actions" },
          title: {
            "logged-in": "Welcome, {{fullName}}!",
            anonymous: "Welcome!",
          },
          items: {
            home: "Home",
            chats: "Chats",
            settings: "Settings",
            posts: "Posts",
            friends: "Friends",
            login: "Login",
            signup: "Create New Account",
            logout: {
              trigger: "Logout",
              dialog: {
                title: "Are you absolutely sure?",
                description:
                  "Are you sure you want to log out? This will end your session, and you will need to log in again to access your account.",
                cancel: "Cancel",
                confirm: "Yes, logout",
              },
            },
          },
        },
        logo: {
          tooltip: "Home",
        },
        search: {
          placeholder: "Search on Link Up...",
          "no-users": "No users found.",
          tooltip: "Search for Users",
          heading: "Search result",
          message: {
            button: {
              tooltip: "Send a Message",
            },
          },
          friendships: {
            button: {
              tooltip: "Add Friend",
            },
            toasts: {
              "already-exists": {
                title: "Friend request already exists.",
                description:
                  "There is already a friendship between you and {{fullName}}.",
                action: "Show Friends",
              },
              "successfully-created": {
                title: "Friend request sent.",
                description: "Friend request was sent to {{fullName}}.",
                action: "Show Friends",
              },
            },
          },
        },
      },
      theme: {
        light: "light",
        dark: "dark",
        switch: {
          tooltip: "Switch to {{mode}} mode",
        },
      },
      time: {
        years: "{{count}} years ago",
        months: "{{count}} months ago",
        weeks: "{{count}} weeks ago",
        days: "{{count}} days ago",
        hours: "{{count}} hours ago",
        minutes: "{{count}} minutes ago",
        now: "Just now",
      },
    },
    home: {
      feed: {
        empty: {
          title: "Nothing here yet",
          description:
            "Start the conversation! Share your thoughts by creating the first post.",
          action: "Write a post",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "Show more",
        "show-less": "Show less",
      },
      new: { button: "Create New Post" },
      edit: {
        button: { tooltip: "Edit" },
      },
      delete: {
        button: { tooltip: "Delete" },
        dialog: {
          title: "Are you absolutely sure?",
          description:
            "Are you sure you want to delete this post? This will delete your post, it's comments, and all files related with this post.",
          cancel: "Cancel",
          confirm: "Yes, delete",
        },
      },
      comments: {
        section: {
          open: "Open comments",
          close: "Close comments",
        },
        tooltip: {
          you: "You",
          messageInfo: "{{name}}: {{date}} {{time}}",
          locale: "en-US",
        },
        buttons: {
          reply: { tooltip: "Reply" },
          extend: { tooltip: "Show replies" },
          reduce: { tooltip: "Close replies" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "Leave your comment...",
            },
            file: { tooltip: "Attach a file", remove: "Remove File" },
          },
          submit: { tooltip: "Send comment" },
          reply: {
            to: {
              me: "Replying to yourself.",
              other: "Replying to {{fullName}}.",
            },
            remove: { tooltip: "Remove reply" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "Filter users..." },
        statuses: {
          input: {
            placeholder: "Filter users...",
            all: "All",
            accepted: "Accepted",
            "awaiting-me": "Awaiting me",
            "awaiting-other": "Awaiting other",
          },
          all: "All ({{count}})",
          accepted: "Accepted ({{count}})",
          "awaiting-me": "Awaiting me ({{count}})",
          "awaiting-other": "Awaiting other ({{count}})",
        },
      },
      column: {
        user: { title: "User" },
        status: { title: "Status" },
      },
      "no-result": {
        title: "No results.",
        description: "Search for people using the",
        link: { text: "navigation bar" },
      },
      cells: {
        statuses: {
          accepted: "Friends",
          "awaiting-me": "Awaiting your approve",
          "awaiting-other": "Awaiting {{fullName}}'s approve",
        },
        actions: {
          trigger: { tooltip: "Show actions" },
          accept: "Accept",
          delete: "Delete",
        },
      },
      toasts: {
        accepted: {
          title: "Friendship accepted.",
          description: "{{fullName}} is your friend now.",
        },
        deleted: {
          title: "Friendship deleted.",
          description: {
            accepted: "{{fullName}} is not your friend anymore.",
            "awaiting-me": "{{fullName}} friend request is rejected.",
            "awaiting-other": "Friend request to {{fullName}} is removed.",
          },
        },
      },
    },
    chats: {
      "no-chat-selected": {
        title: "No chat selected.",
        description: "Select existing chat in the menu or",
        action: "Create new chat",
      },
      "chat-unavailable": {
        title: "Chat unavailable.",
        description:
          "Selected chat does not exist or is not available for you.",
        action: "Close",
      },
      navigation: {
        title: "Chat with others",
        items: {
          tooltip: "Open chat",
          "only-file-text": "{{fullName}} sent {{count}} file(s).",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "Create chat" },
        dialog: {
          title: "Create new chat",
          description:
            "Search and invite other users to your newly created chat. Click on the user to invite him to the chat.",
        },
        tabs: {
          private: "Private",
          group: "Group",
        },
        private: {
          form: {
            input: {
              placeholder: "Search for people...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "Chat display name (optional)" },
              search: { placeholder: "Search for people..." },
            },
          },
        },
        "invited-users": "Invited people",
        submit: "Create chat",
      },
      form: {
        inputs: {
          text: { placeholder: "Type..." },
          file: { tooltip: "Attach a file", remove: "Remove file" },
        },
        submit: { tooltip: "Send message" },
        reply: {
          author: { me: "Replying to me", other: "Replying to {{name}}" },
          "only-files": "Sent {{count}} file(s).",
          cancel: { tooltip: "Cancel" },
        },
      },
      "income-message": {
        text: "{{name}}: {{text}}",
        "only-files": "{{name}} sent {{count}} file(s).",
      },
      "date-seperator": {
        locale: "en-US",
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
          mine: "{{date}} by You",
          foreign: "{{date}} by {{name}}",
        },
      },
    },
  },
};

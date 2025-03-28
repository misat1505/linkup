import { Translation } from "./types";

export const zh: { translation: Translation } = {
  translation: {
    login: {
      greeting: "欢迎体验",
      slogan:
        "沉浸在一个社交网络中，与朋友联系、分享你的时刻、发现新社区只需轻轻一点。",
      form: {
        placeholders: {
          login: "用户名",
          password: "密码",
        },
        submit: {
          idle: "登录",
          pending: "登录中...",
        },
        errors: {
          login: {
            min: "用户名必须至少5个字符。",
            max: "用户名最多不能超过50个字符。",
          },
          password: {
            min: "密码必须至少5个字符。",
          },
        },
      },
      "no-account": "还没有账户？",
      "sign-in-redirect": "注册",
    },
    signup: {
      header: {
        1: "加入",
        2: "网络",
      },
      slogan: "今天就开始你的旅程，发现一个充满联系和机会的世界。",
      form: {
        placeholders: {
          firstname: "名字",
          lastname: "姓氏",
          login: "用户名",
          password: "密码",
          "confirm-password": "确认密码",
        },
        errors: {
          firstname: {
            min: "名字不能为空。",
            max: "名字最多不能超过50个字符。",
          },
          lastname: {
            min: "姓氏不能为空。",
            max: "姓氏最多不能超过50个字符。",
          },
          login: {
            min: "用户名必须至少5个字符。",
            max: "用户名最多不能超过50个字符。",
          },
          password: {
            min: "密码必须至少5个字符。",
            mismatch: "密码不匹配。",
          },
        },
        "remove-image": "移除",
        submit: {
          idle: "注册",
          pending: "注册中...",
        },
      },
      "already-have-account": "已有账户？",
      "login-redirect": "登录",
    },
    settings: {
      language: {
        title: "语言",
        description: "选择你喜欢的界面语言。",
      },
      theme: {
        title: "主题",
        description: "在明亮和黑暗主题之间切换，以适应你的喜好。",
      },
      tooltips: {
        title: "提示",
        description: "启用或禁用提示，以在应用中获得额外的指导。",
      },
      slogan:
        "自定义你的设置，让Link Up真正属于你。切换主题、调整偏好，塑造你与平台互动的方式。",
      header: {
        1: "个性化",
        2: "你的体验",
      },
      form: {
        submit: {
          idle: "更新",
          pending: "更新中...",
        },
      },
    },
    common: {
      you: "你",
      loading: "请稍候，我们正在准备应用...",
      navbar: {
        sheet: {
          trigger: { tooltip: "显示操作" },
          title: {
            "logged-in": "欢迎，{{fullName}}！",
            anonymous: "欢迎！",
          },
          items: {
            home: "首页",
            chats: "聊天",
            settings: "设置",
            posts: "帖子",
            friends: "朋友",
            login: "登录",
            signup: "创建新账户",
            logout: {
              trigger: "退出",
              dialog: {
                title: "你确定吗？",
                description:
                  "你确定要退出吗？这将结束你的会话，你需要再次登录才能访问你的账户。",
                cancel: "取消",
                confirm: "是的，退出",
              },
            },
          },
        },
        logo: {
          tooltip: "首页",
        },
        search: {
          placeholder: "在Link Up上搜索...",
          "no-users": "未找到用户。",
          tooltip: "搜索用户",
          heading: "搜索结果",
          message: {
            button: {
              tooltip: "发送消息",
            },
          },
          friendships: {
            button: {
              tooltip: "添加朋友",
            },
            toasts: {
              "already-exists": {
                title: "好友请求已存在。",
                description: "你和{{fullName}}之间已存在好友关系。",
                action: "查看好友",
              },
              "successfully-created": {
                title: "好友请求已发送。",
                description: "好友请求已发送给{{fullName}}。",
                action: "查看好友",
              },
            },
          },
        },
      },
      theme: {
        light: "明亮",
        dark: "黑暗",
        switch: {
          tooltip: "切换到{{mode}}模式",
        },
      },
      time: {
        years: "{{count}}年前",
        months: "{{count}}个月前",
        weeks: "{{count}}周前",
        days: "{{count}}天前",
        hours: "{{count}}小时前",
        minutes: "{{count}}分钟前",
        now: "刚刚",
        ago: "前",
      },
    },
    home: {
      feed: {
        empty: {
          title: "这里还没有内容",
          description: "开始对话吧！通过创建第一个帖子分享你的想法。",
          action: "写帖子",
        },
      },
    },
    posts: {
      preview: {
        "show-more": "显示更多",
        "show-less": "收起",
      },
      new: { button: "创建新帖子" },
      edit: {
        button: { tooltip: "编辑" },
      },
      delete: {
        button: { tooltip: "删除" },
        dialog: {
          title: "你确定吗？",
          description:
            "你确定要删除这个帖子吗？这将删除你的帖子、评论以及所有相关文件。",
          cancel: "取消",
          confirm: "是的，删除",
        },
      },
      comments: {
        section: {
          open: "打开评论",
          close: "关闭评论",
        },
        tooltip: {
          you: "你",
          messageInfo: "{{name}}：{{date}} {{time}}",
          locale: "zh-CN",
        },
        buttons: {
          reply: { tooltip: "回复" },
          extend: { tooltip: "显示回复" },
          reduce: { tooltip: "收起回复" },
        },
        form: {
          inputs: {
            text: {
              placeholder: "留下你的评论...",
            },
            file: { tooltip: "附加文件", remove: "移除文件" },
          },
          submit: { tooltip: "发送评论" },
          reply: {
            to: {
              me: "回复自己。",
              other: "回复{{fullName}}。",
            },
            remove: { tooltip: "移除回复" },
          },
        },
      },
    },
    friends: {
      filter: {
        input: { placeholder: "筛选用户..." },
        statuses: {
          input: {
            placeholder: "筛选用户...",
            all: "全部",
            accepted: "已接受",
            "awaiting-me": "等待我",
            "awaiting-other": "等待对方",
          },
          all: "全部 ({{count}})",
          accepted: "已接受 ({{count}})",
          "awaiting-me": "等待我 ({{count}})",
          "awaiting-other": "等待对方 ({{count}})",
        },
      },
      column: {
        user: { title: "用户" },
        status: { title: "状态" },
      },
      "no-result": {
        title: "无结果。",
        description: "使用",
        link: { text: "导航栏" },
      },
      cells: {
        statuses: {
          accepted: "朋友",
          "awaiting-me": "等待你的批准",
          "awaiting-other": "等待{{fullName}}的批准",
        },
        actions: {
          trigger: { tooltip: "显示操作" },
          accept: "接受",
          delete: "删除",
        },
      },
      toasts: {
        accepted: {
          title: "好友关系已接受。",
          description: "{{fullName}}现在是你的朋友。",
        },
        deleted: {
          title: "好友关系已删除。",
          description: {
            accepted: "{{fullName}}不再是你的朋友。",
            "awaiting-me": "{{fullName}}的好友请求已被拒绝。",
            "awaiting-other": "发送给{{fullName}}的好友请求已被移除。",
          },
        },
      },
    },
    chats: {
      "no-chats": "还没有对话。开始聊天，与他人联系吧！",
      "no-chat-selected": {
        title: "未选择聊天。",
        description: "在菜单中选择现有聊天或",
        action: "创建新聊天",
      },
      "chat-unavailable": {
        title: "聊天不可用。",
        description: "所选聊天不存在或对你不可用。",
        action: "关闭",
      },
      navigation: {
        title: "与他人聊天",
        items: {
          tooltip: "打开聊天",
          "only-file-text": "{{fullName}}发送了{{count}}个文件。",
        },
      },
      "create-new-chat": {
        trigger: { tooltip: "创建聊天" },
        dialog: {
          title: "创建新聊天",
          description:
            "搜索并邀请其他用户加入你新建的聊天。点击用户以邀请他们加入聊天。",
        },
        tabs: {
          private: "私人",
          group: "群组",
        },
        private: {
          form: {
            input: {
              placeholder: "搜索用户...",
            },
          },
        },
        group: {
          form: {
            inputs: {
              name: { placeholder: "聊天显示名称（可选）" },
              search: { placeholder: "搜索用户..." },
            },
          },
        },
        "invited-users": "已邀请的用户",
        submit: "创建聊天",
      },
      form: {
        inputs: {
          text: { placeholder: "输入..." },
          file: { tooltip: "附加文件", remove: "移除文件" },
        },
        submit: { tooltip: "发送消息" },
        reply: {
          author: { me: "回复自己", other: "回复{{name}}" },
          "only-files": "发送了{{count}}个文件。",
          cancel: { tooltip: "取消" },
        },
      },
      "income-message": {
        text: "{{name}}：{{text}}",
        "only-files": "{{name}}发送了{{count}}个文件。",
      },
      "date-seperator": {
        locale: "zh-CN",
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
          mine: "{{date}} 由你发送",
          foreign: "{{date}} 由{{name}}发送",
        },
        controls: {
          reply: { tooltip: "回复" },
          reaction: {
            trigger: { tooltip: "创建反应" },
            title: "创建你的反应",
            "already-reacted": "你已为此消息创建了反应。",
            "not-available": "目前无法反应。",
            values: {
              happy: "开心",
              sad: "难过",
              crying: "哭泣",
              heart: "爱心",
              skull: "骷髅",
            },
          },
        },
        reply: {
          "only-files": "{{name}}发送了{{count}}个文件。",
          text: {
            "you-to-you": "你回复了自己。",
            "you-to-other": "你回复了{{name}}。",
            "other-to-you": "{{name}}回复了你。",
            "other-to-other": "{{name1}}回复了{{name2}}。",
            "other-to-same": "{{name}}回复了自己。",
          },
        },
      },
      leave: {
        trigger: { tooltip: "离开聊天" },
        dialog: {
          title: "离开聊天",
          description:
            "你确定要离开这个聊天吗？离开后，你将无法访问正在进行的对话。如果确定，请在下方确认。",
          cancel: "取消",
          confirm: "离开",
        },
      },
      "user-activity": {
        online: "在线",
        offline: "离线",
        "time-units": {
          min: "分钟",
          hr: "小时",
        },
      },
      close: {
        tooltip: "关闭聊天",
      },
      settings: {
        trigger: { tooltip: "设置" },
        title: "设置",
        description: {
          private:
            "管理此聊天的成员，查看当前参与对话的人员。你可以根据需要更新或移除他们的别名。",
          group:
            "管理此聊天的成员，查看当前参与对话的人员。你可以根据需要更新或移除他们的别名。此外，你还可以邀请新用户加入聊天。",
        },
        users: {
          actions: {
            "send-message": { tooltip: "发送消息" },
            "update-alias": { tooltip: "更新别名" },
          },
        },
        "update-alias-dialog": {
          title: "更新{{name}}的别名",
          description:
            "你可以为该用户更新别名。此别名将代替他们在聊天中的全名显示。请在下方确认新别名，留空以移除别名。",
          cancel: "取消",
          confirm: "保存",
          input: { placeholder: "创建别名" },
          "no-alias": "（无别名）",
        },
        group: {
          tabs: {
            general: "常规",
            members: "成员",
            invite: "邀请",
          },
          info: {
            input: {
              name: { placeholder: "群组名称..." },
              file: { remove: "移除" },
            },
            submit: "保存",
          },
          invite: {
            search: { placeholder: "搜索用户..." },
            empty: "输入以搜索用户。",
            "no-result": "未找到用户。",
            trigger: { tooltip: "邀请{{name}}加入此聊天" },
            dialog: {
              title: "邀请{{name}}加入此聊天",
              description:
                "你确定要邀请{{name}}加入此聊天吗？一旦被邀请，他们将能够查看并参与对话。请在下方确认你的操作。",
              cancel: "取消",
              confirm: "邀请",
            },
          },
        },
      },
    },
  },
};

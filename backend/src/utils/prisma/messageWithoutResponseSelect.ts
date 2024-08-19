import { userSelect } from "./userSelect";

export const messageWithoutResponseSelect = {
  id: true,
  content: true,
  author: {
    select: userSelect,
  },
  createdAt: true,
  chatId: true,
  files: {
    select: {
      id: true,
      url: true,
    },
  },
} as const;

import { PrismaClient } from "@prisma/client";
// import { z } from "zod";
import { User, UserWithCredentials } from "../../src/types/User";
import { Post } from "../../src/types/Post";
import { userSelect } from "../../src/utils/prisma/userSelect";
import { postChatSelect } from "../../src/utils/prisma/postChatSelect";
import { PostService } from "../../src/services/PostService";
import { initReactions, reactions } from "../../src/config/reactions";

// export const TestSeed = z.object({
//   users: z.array(User),
//   posts: z.array(Post),
// });

// export type TestSeed = z.infer<typeof TestSeed>;

type ChatEntity = {
  id: string;
  createdAt: Date;
  name: string | null;
  photoURL: string | null;
  type: string;
  lastMessageId: string | null;
};

type MessageEntity = {
  id: string;
  content: string | null;
  authorId: string;
  createdAt: Date;
  responseId: string | null;
  chatId: string;
};

export type TestSeed = {
  users: UserWithCredentials[];
  posts: Post[];
  chats: ChatEntity[];
  messages: MessageEntity[];
  reactions: typeof reactions;
};

export async function seedDatabase(prisma: PrismaClient): Promise<TestSeed> {
  await prisma.user.createMany({
    data: [
      {
        id: "3daf7676-ec0f-4548-85a7-67b4382166d4",
        login: "login2",
        password:
          "37b4a40ef177c39863a3fa75de835f4ab276c18f00ba4e909e54b039215143d0", // "pass2"
        firstName: "Kylian",
        lastName: "Mekambe",
        photoURL: "65ee3504-123f-4ccb-b6c9-97f8e302b40d.webp",
        lastActive: new Date(),
        salt: "$2a$10$MeDYRqv3QH3jcggJCtiRoe",
      },
      {
        id: "935719fa-05c4-42c4-9b02-2be3fefb6e61",
        firstName: "Jane",
        lastName: "Doe",
        login: "login1",
        password:
          "37b4a40ef177c39863a3fa75de835f4ab276c18f00ba4e909e54b039215143d0", // "pass2"
        salt: "random_salt_for_jane",
        lastActive: new Date(),
        photoURL: "some_photo_url_for_jane.webp",
      },
    ],
  });
  const users = await prisma.user.findMany();

  const postChat = await prisma.chat.create({
    data: { type: "POST" },
  });
  await prisma.post.createMany({
    data: [
      {
        id: "25776a73-a5c6-40cf-b77f-76288a34cfa7",
        content: "### hello post",
        authorId: users[0].id,
        chatId: postChat.id,
      },
    ],
  });
  const dirtyPosts = await prisma.post.findMany({
    include: {
      author: { select: userSelect },
      chat: {
        select: postChatSelect,
      },
    },
  });
  const posts = dirtyPosts.map((p) => Post.parse(p));

  const chat1 = await prisma.chat.create({
    data: {
      id: "74c78678-40b2-44cf-8436-fdc762480e92",
      type: "PRIVATE",
      users: {
        create: [
          { user: { connect: { id: users[0].id } } },
          { user: { connect: { id: users[1].id } } },
        ],
      },
    },
  });

  const chat2 = await prisma.chat.create({
    data: {
      id: "49794983-95cb-4ff1-b90b-8b393e86fd85",
      type: "GROUP",
      name: "Group Chat",
      users: {
        create: [{ user: { connect: { id: users[0].id } } }],
      },
      photoURL: "chat-photo.webp",
    },
  });

  const message1 = await prisma.message.create({
    data: {
      id: "01918dfb-ddd4-7e01-84df-1c8321cc9852",
      content: "Hello from chat1",
      authorId: users[0].id,
      chatId: chat1.id,
      files: {
        create: {
          url: "chat-message.webp",
        },
      },
    },
  });

  const message2 = await prisma.message.create({
    data: {
      id: "01918dfc-01b4-70f5-967b-aeecbe07a2b1",
      content: "Welcome to chat2",
      authorId: users[0].id,
      chatId: chat2.id,
    },
  });

  await initReactions(prisma);

  await prisma.userReaction.create({
    data: {
      userId: users[0].id,
      messageId: message1.id,
      reactionId: reactions[0].id,
    },
  });

  const seed: TestSeed = {
    users,
    posts: posts as any,
    chats: [chat1, chat2],
    messages: [message1, message2],
    reactions,
  };

  // TestSeed.parse(seed);

  return seed;
}

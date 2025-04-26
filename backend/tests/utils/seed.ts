import { PrismaClient } from "@prisma/client";
// import { z } from "zod";
import { User } from "../../src/types/User";
import { Post } from "../../src/types/Post";
import { userSelect } from "../../src/utils/prisma/userSelect";
import { postChatSelect } from "../../src/utils/prisma/postChatSelect";
import { PostService } from "../../src/services/PostService";

// export const TestSeed = z.object({
//   users: z.array(User),
//   posts: z.array(Post),
// });

// export type TestSeed = z.infer<typeof TestSeed>;

export type TestSeed = {
  users: User[];
  posts: Post[];
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
  const posts = dirtyPosts.map(PostService.sanitizePost);

  const seed: TestSeed = { users, posts };

  // TestSeed.parse(seed);

  return seed;
}

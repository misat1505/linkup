import { prisma } from "@/lib/Prisma";
import { USER } from "./constants";

const tables = [
  "Friend",
  "User",
  "Chat",
  "Message",
  "UserReaction",
  "File",
  "UserChat",
  "Post",
  "PostReport",
];

export const resetDB = async (): Promise<void> => {
  await prisma.$transaction(async (prisma) => {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${table}" DISABLE TRIGGER ALL;`
      );
    }

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
    }

    for (const table of tables) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${table}" ENABLE TRIGGER ALL;`
      );
    }

    const user = await prisma.user.create({
      data: USER,
    });

    const user2 = await prisma.user.create({
      data: {
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
    });

    const chat1 = await prisma.chat.create({
      data: {
        id: "74c78678-40b2-44cf-8436-fdc762480e92",
        type: "PRIVATE",
        users: {
          create: [
            { user: { connect: { id: user.id } } },
            { user: { connect: { id: user2.id } } },
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
          create: [{ user: { connect: { id: user.id } } }],
        },
        photoURL: "chat-photo.webp",
      },
    });

    const message1 = await prisma.message.create({
      data: {
        id: "01918dfb-ddd4-7e01-84df-1c8321cc9852",
        content: "Hello from chat1",
        authorId: user.id,
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
        authorId: user.id,
        chatId: chat2.id,
      },
    });

    await prisma.userReaction.create({
      data: {
        userId: user.id,
        messageId: message1.id,
        reactionId: "c3dd47c4-2192-4926-8ec0-b822d14b288d",
      },
    });

    const postChat = await prisma.chat.create({
      data: { type: "POST" },
    });

    const post = await prisma.post.create({
      data: {
        id: "25776a73-a5c6-40cf-b77f-76288a34cfa7",
        content: "### hello post",
        authorId: user.id,
        chatId: postChat.id,
      },
    });
  });
};

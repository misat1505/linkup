import { prisma } from "../lib/Prisma";

type Reaction = { id: string; name: string };

export const reactions: Reaction[] = [
  {
    id: "c3dd47c4-2192-4926-8ec0-b822d14b288d",
    name: "happy",
  },
  {
    id: "9aed7a49-238d-4c29-b5b9-368bb0253e8b",
    name: "sad",
  },
  {
    id: "cfe7cc4c-88db-43ce-807d-37e8c738be8a",
    name: "crying",
  },
  {
    id: "57afc544-78c7-43fe-9cbe-fb17ae99a258",
    name: "heart",
  },
  {
    id: "6c267520-7742-4d6f-ba3c-276a04bd9e00",
    name: "skull",
  },
];

export async function initReactions() {
  await Promise.all(
    reactions.map(async (reaction) => {
      const existingReaction = await prisma.reaction.findUnique({
        where: { id: reaction.id },
      });

      if (!existingReaction) {
        await prisma.reaction.create({
          data: reaction,
        });
      }
    })
  );
}

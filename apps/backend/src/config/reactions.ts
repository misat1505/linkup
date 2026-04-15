import { prisma as globalPrisma } from "../lib/Prisma";

type Reaction = { id: string; name: string };

/**
 * A predefined list of reactions to be initialized in the database.
 *
 * @remarks
 * This list contains predefined reactions such as "happy", "sad", and others.
 * The reactions are stored in an array of objects where each object contains an `id` and a `name`.
 *
 * @source
 */
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

/**
 * Initializes predefined reactions in the database.
 *
 * @remarks
 * This function checks if the reactions already exist in the database. If a reaction is not found, it is created in the database.
 *
 * @returns {Promise<void>} A promise that resolves when all reactions have been checked and initialized.
 *
 * @source
 */
export async function initReactions(prisma = globalPrisma): Promise<void> {
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

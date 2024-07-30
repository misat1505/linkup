import { prisma } from "../../src/lib/Prisma";
import { USER } from "./constants";

export const resetDB = async (): Promise<void> => {
  await prisma.$transaction(async (prisma) => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: USER,
    });
  });
};

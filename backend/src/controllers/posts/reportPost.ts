import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/PostService";
import { Prisma } from "@prisma/client";

export const reportPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req.body.token;

    await PostService.reportPost(userId, id);

    res.status(200).json({ message: "Post reported successfully." });
  } catch (e) {
    const violatedUniqueConstraint =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

    if (violatedUniqueConstraint) {
      next(new Error("ahuygdygfs"));
    }
    next(new Error(req.t("posts.controllers.get-all.failure")));
  }
};

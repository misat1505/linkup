import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

/**
 * Controller to report a post by an authenticated user.
 *
 * @remarks
 * This controller allows a user to report a post by its ID. It uses the `PostService` to create a report entry
 * linking the user to the reported post. If the user has already reported the post, a unique constraint error (P2002)
 * is caught and an appropriate message is returned. All other errors are treated as general failures.
 *
 * @param {Request} req - The Express request object, containing the post ID in the URL parameters and user ID in the token payload.
 * @param {Response} res - The Express response object, used to return a success message if the report is created.
 * @param {NextFunction} next - The Express next function used for error handling and forwarding localized error messages.
 *
 * @source
 *
 * @swagger
 * /posts/{id}/report:
 *   post:
 *     summary: Report a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to report
 *     responses:
 *       200:
 *         description: Post reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Post reported successfully.
 *       409:
 *         description: This post had been previously reported by you.
 *       500:
 *         description: Couldn't report post.
 */
export const reportPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req.body.token;
    const postService = req.app.services.postService;

    await postService.reportPost(userId, id);

    res
      .status(200)
      .json({ message: req.t("posts.controllers.report.success") });
  } catch (e) {
    const violatedUniqueConstraint =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

    if (violatedUniqueConstraint) {
      res
        .status(409)
        .json({ message: req.t("posts.controllers.report.already-reported") });
      return;
    }

    next(new Error(req.t("posts.controllers.report.failure")));
  }
};

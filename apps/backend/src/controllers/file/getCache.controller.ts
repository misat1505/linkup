import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve a list of files from the user's cache.
 *
 * @remarks
 * This controller allows the user to retrieve the list of files currently stored in their cache. It fetches the file names from the file storage and returns them in a response. If successful, it provides a list of filenames; if there is an error in fetching the files, it handles the error and provides an appropriate response.
 *
 * @param {Request} req - The Express request object, containing the user’s identifier to retrieve their cached files.
 * @param {Response} res - The Express response object used to send the list of cached file names back to the client.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /files/cache:
 *   get:
 *     summary: Retrieve a list of files from the user's cache
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: Files in the cache listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: List of file names in the user's cache.
 *                     example: ["file1.jpg", "file2.png", "file3.pdf"]
 *       500:
 *         description: Cannot read cache due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot read cache."
 */
export const getCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const fileStorage = req.app.services.fileStorage;

    const files = await fileStorage.listFiles(`cache/${userId}`);

    const filenames = files.map((filename) => {
      const splitted = filename.split("/");
      return splitted[splitted.length - 1];
    });

    return res.status(StatusCodes.OK).json({ files: filenames });
  } catch (e) {
    next(new Error(req.t("files.controllers.get-cache.failure")));
  }
};

import { NextFunction, Request, Response } from "express";
import { Filename } from "@/validators/files/getFiles.validators";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to delete a file from the user's cache.
 *
 * @remarks
 * This controller allows the user to delete a specific file from their cache by providing the file's name. It checks the file storage and performs the deletion. If successful, it returns a success message. If the file is not found or there is an error during the process, it handles the respective cases with appropriate responses.
 *
 * @param {Request} req - The Express request object containing the file name to be deleted and the user's identifier.
 * @param {Response} res - The Express response object used to return the result of the deletion operation.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /files/cache/{filename}:
 *   delete:
 *     summary: Delete a file from the user's cache
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to delete from the cache
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully."
 *       404:
 *         description: File not found in cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File not found."
 *       500:
 *         description: Server error during file deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete file from cache."
 */
export const deleteFromCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { filename } = req.validated!.params! as Filename;
    const fileStorage = req.app.services.fileStorage;

    await fileStorage.deleteFile(`cache/${userId}/${filename}`);

    return res
      .status(StatusCodes.OK)
      .json({ message: req.t("files.controllers.delete-from-cache.success") });
  } catch (e) {
    next(new Error(req.t("files.controllers.delete-from-cache.failure")));
  }
};

import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import fileStorage from "../../lib/FileStorage";

export const deleteFromCache = async (req: Request, res: Response) => {
  /**
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
  try {
    const { userId } = req.body.token;
    const { filename } = req.params;

    await fileStorage.deleteFile(`cache/${userId}/${filename}`);

    return res.status(200).json({ message: "File deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot delete file from cache." });
  }
};

import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getCache = async (req: Request, res: Response) => {
  /**
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
  try {
    const { userId } = req.body.token;

    const userCachePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "files",
      "cache",
      userId
    );

    if (!fs.existsSync(userCachePath))
      fs.mkdirSync(userCachePath, { recursive: true });

    const files = fs.readdirSync(userCachePath);

    return res.status(200).json({ files });
  } catch (e) {
    return res.status(500).json({ message: "Cannot read cache." });
  }
};

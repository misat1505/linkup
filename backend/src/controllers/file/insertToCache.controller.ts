import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import fileStorage from "../../lib/FileStorage";
import { generateNewFilename } from "../../utils/generateNewFilename";

export const CACHE_CAPACITY = 10;

export const insertToCache = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /files/cache:
   *   post:
   *     summary: Upload a file to the user's cache
   *     tags: [Files]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The file to be inserted into the cache.
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 file:
   *                   type: string
   *                   description: The new UUID filename of the uploaded file.
   *                   example: "a1b2c3d4-5678-9101-1234-56789abcdef0.jpg"
   *       500:
   *         description: Cache limit reached or server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cache limit reached. Maximum number of files in cache: 10"
   */
  try {
    const file = req.file;
    const { userId } = req.body.token;

    if (!file)
      return res.status(400).json({ message: "Attach a file to upload it." });

    const cachePaths = await fileStorage.listFiles(`cache/${userId}`);

    if (cachePaths.length >= CACHE_CAPACITY) {
      return res.status(500).json({
        message: `Cache limit reached. Maximum number of files in cache: ${CACHE_CAPACITY}`,
      });
    }

    const filename = generateNewFilename(file.originalname);

    await fileStorage.uploadFile(
      file.buffer,
      file.mimetype,
      `cache/${userId}/${filename}`
    );

    return res.status(201).json({ file: filename });
  } catch (e) {
    return res.status(500).json({ message: "Cannot insert to cache." });
  }
};

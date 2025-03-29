import { NextFunction, Request, Response } from "express";
import fileStorage from "../../lib/FileStorage";
import { generateNewFilename } from "../../utils/generateNewFilename";

export const CACHE_CAPACITY = 10;

/**
 * Controller to upload a file to the user's cache.
 *
 * @remarks
 * This controller handles the logic of uploading a file to the user's cache storage. It validates the presence of a file in the request, checks if the user has reached the cache capacity limit, and if not, uploads the file with a newly generated filename. The function responds with a success message containing the new filename or an error message if the cache limit is reached or the file upload fails.
 *
 * @param {Request} req - The Express request object containing the file to upload and the user token.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const insertToCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const { userId } = req.body.token;

    if (!file)
      return res
        .status(400)
        .json({ message: req.t("files.controllers.insert-to-cache.no-file") });

    const cachePaths = await fileStorage.listFiles(`cache/${userId}`);

    if (cachePaths.length >= CACHE_CAPACITY) {
      return res.status(500).json({
        message: req.t("files.controllers.insert-to-cache.limit-reached", {
          count: CACHE_CAPACITY,
        }),
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
    next(new Error(req.t("files.controllers.insert-to-cache.failure")));
  }
};

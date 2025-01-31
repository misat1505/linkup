import multer from "multer";

/**
 * Multer middleware to handle file uploads.
 *
 * This middleware uses `multer` to handle file uploads. By default, it stores the files in memory
 * and doesn't define specific storage options (e.g., disk storage or cloud storage).
 * The files can be accessed via `req.file` (for single file uploads) or `req.files` (for multiple file uploads).
 * You can customize the storage settings by providing options to `multer()` such as file size limits and file type restrictions.
 *
 * @source
 */
export const upload = multer();

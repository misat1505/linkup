import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { authorize } from "../../middlewares/authorize";
import { FileControllers } from "../../controllers";

/**
 * File Routes Router.
 *
 * This router manages file-related operations including uploading files to cache,
 * retrieving files from cache, and deleting files from cache. It also supports
 * authorization for file insertions and uses multer for file uploads.
 */
const fileRouter = Router();

fileRouter.get("/cache", FileControllers.getCache);
fileRouter.delete("/cache/:filename", FileControllers.deleteFromCache);
fileRouter.post(
  "/cache",
  upload.single("file"),
  authorize,
  FileControllers.insertToCache
);
fileRouter.get("/:filename", FileControllers.getFile);

export default fileRouter;

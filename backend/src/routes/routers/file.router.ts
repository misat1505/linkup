import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { authorize } from "../../middlewares/authorize";
import { FileControllers } from "../../controllers";
import { validate } from "../../middlewares/validate";
import {
  Filename,
  FileQuery,
} from "../../validators/files/getFiles.validators";

/**
 * File Routes Router.
 *
 * This router manages file-related operations including uploading files to cache,
 * retrieving files from cache, and deleting files from cache. It also supports
 * authorization for file insertions and uses multer for file uploads.
 */
const fileRouter = Router();

fileRouter.get("/cache", FileControllers.getCache);
fileRouter.delete(
  "/cache/:filename",
  validate({ params: Filename }),
  FileControllers.deleteFromCache
);
fileRouter.post("/cache", upload.single("file"), FileControllers.insertToCache);
fileRouter.get(
  "/:filename",
  validate({ params: Filename, query: FileQuery }),
  FileControllers.getFile
);

export default fileRouter;

import { Router } from "express";
import { getFileController } from "../../controllers/file/getFile.controller";
import { getCache } from "../../controllers/file/getCache.controller";
import { insertToCache } from "../../controllers/file/insertToCache.controller";
import { upload } from "../../middlewares/multer";
import { authorize } from "../../middlewares/authorize";
import { deleteFromCache } from "../../controllers/file/deleteFromCache.controller";

/**
 * File Routes Router.
 *
 * This router manages file-related operations including uploading files to cache,
 * retrieving files from cache, and deleting files from cache. It also supports
 * authorization for file insertions and uses multer for file uploads.
 */
const fileRouter = Router();

fileRouter.get("/cache", getCache);
fileRouter.delete("/cache/:filename", deleteFromCache);
fileRouter.post("/cache", upload.single("file"), authorize, insertToCache);
fileRouter.get("/:filename", getFileController);

export default fileRouter;

import { FileControllers } from "@/controllers";
import { upload } from "@/middlewares/multer";
import { buildProtectedRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * File Routes Router.
 *
 * This router manages file-related operations including uploading files to cache,
 * retrieving files from cache, and deleting files from cache. It also supports
 * authorization for file insertions and uses multer for file uploads.
 */
const routes = [
  buildProtectedRoute(API_CONTRACT.GET_CACHE, FileControllers.getCache),
  buildProtectedRoute(
    API_CONTRACT.DELETE_FROM_CACHE,
    FileControllers.deleteFromCache,
  ),
  buildProtectedRoute(
    API_CONTRACT.INSERT_TO_CACHE,
    FileControllers.insertToCache,
    { extraMiddlewares: [upload.single("file")] },
  ),
  buildProtectedRoute(API_CONTRACT.GET_FILE, FileControllers.getFile),
];

export default buildRouter(routes);

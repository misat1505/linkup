import { deleteFromCache as deleteFromCacheController } from "./deleteFromCache.controller";
import { getCache as getCacheController } from "./getCache.controller";
import { getFileController } from "./getFile.controller";
import { insertToCache as insertToCacheController } from "./insertToCache.controller";

export const FileControllers = {
  deleteFromCache: deleteFromCacheController,
  getCache: getCacheController,
  getFile: getFileController,
  insertToCache: insertToCacheController,
};

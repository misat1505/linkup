import { deleteFromCache as deleteFromCacheController } from "./deleteFromCache.controller";
import { getCache as getCacheController } from "./getCache.controller";
import { getFileController } from "./getFile.controller";
import { insertToCache as insertToCacheController } from "./insertToCache.controller";

export namespace FileControllers {
  export const deleteFromCache = deleteFromCacheController;
  export const getCache = getCacheController;
  export const getFile = getFileController;
  export const insertToCache = insertToCacheController;
}

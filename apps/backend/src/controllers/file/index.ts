import { deleteFromCache as deleteFromCacheController } from "./delete-from-cache.controller";
import { getCache as getCacheController } from "./get-cache.controller";
import { getFileController } from "./get-file.controller";
import { insertToCache as insertToCacheController } from "./insert-to-cache.controller";

export const FileControllers = {
	deleteFromCache: deleteFromCacheController,
	getCache: getCacheController,
	getFile: getFileController,
	insertToCache: insertToCacheController,
};

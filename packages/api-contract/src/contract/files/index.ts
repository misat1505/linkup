import { deleteFromCacheRoute } from "./delete-from-cache";
import { getCacheRoute } from "./get-cache";
import { getFileRoute } from "./get-file";
import { insertToCacheRoute } from "./insert-to-cache";

export const filesContract = {
	DELETE_FROM_CACHE: deleteFromCacheRoute,
	GET_CACHE: getCacheRoute,
	GET_FILE: getFileRoute,
	INSERT_TO_CACHE: insertToCacheRoute,
};

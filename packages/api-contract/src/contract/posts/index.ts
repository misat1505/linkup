import { createPostRoute } from "./create-post";
import { deletePostRoute } from "./delete-post";
import { getPostRoute } from "./get-post";
import { getPostsRoute } from "./get-posts";
import { getUserPostsRoute } from "./get-user-posts";
import { reportPostRoute } from "./report-post";
import { updatePostRoute } from "./update-post";

export const postsContract = {
	CREATE_POST: createPostRoute,
	DELETE_POST: deletePostRoute,
	GET_POST: getPostRoute,
	GET_POSTS: getPostsRoute,
	GET_USER_POSTS: getUserPostsRoute,
	REPORT_POST: reportPostRoute,
	UPDATE_POST: updatePostRoute,
};

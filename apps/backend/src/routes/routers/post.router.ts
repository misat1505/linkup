import { PostControllers } from "@/controllers";
import { authorizePassthrough } from "@/middlewares/authorize";
import { buildProtectedRoute, buildRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * Post Routes Router.
 *
 * This router handles operations related to posts, including creating, reading,
 * updating, and deleting posts, as well as retrieving posts specific to the user.
 */

const routes = [
	buildProtectedRoute(API_CONTRACT.UPDATE_POST, PostControllers.updatePost),
	buildProtectedRoute(API_CONTRACT.GET_USER_POSTS, PostControllers.getUserPosts),
	buildProtectedRoute(API_CONTRACT.GET_POST, PostControllers.getPost),
	buildProtectedRoute(API_CONTRACT.DELETE_POST, PostControllers.deletePost),
	buildRoute(API_CONTRACT.GET_POSTS, PostControllers.getPosts, {
		extraMiddlewares: [authorizePassthrough],
	}),
	buildProtectedRoute(API_CONTRACT.REPORT_POST, PostControllers.reportPost),
	buildProtectedRoute(API_CONTRACT.CREATE_POST, PostControllers.createPost),
];

export default buildRouter(routes);

import { FriendshipControllers } from "@/controllers";
import { buildProtectedRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * Friendship Routes Router.
 *
 * This router handles operations related to user friendships, including viewing,
 * creating, accepting, and deleting friendships.
 */
const routes = [
	buildProtectedRoute(API_CONTRACT.GET_USER_FRIENDSHIPS, FriendshipControllers.getUserFriendships),
	buildProtectedRoute(API_CONTRACT.ACCEPT_FRIENDSHIP, FriendshipControllers.acceptFriendship),
	buildProtectedRoute(API_CONTRACT.CREATE_FRIENDSHIP, FriendshipControllers.createFriendship),
	buildProtectedRoute(API_CONTRACT.DELETE_FRIENDSHIP, FriendshipControllers.deleteFriendship),
];

export default buildRouter(routes);

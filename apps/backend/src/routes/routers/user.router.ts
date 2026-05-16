import { UserControllers } from "@/controllers";
import { buildProtectedRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * User Routes Router.
 *
 * This router handles user-related operations, including searching for users.
 */
const routes = [buildProtectedRoute(API_CONTRACT.SEARCH_USER, UserControllers.searchUser)];

export default buildRouter(routes);

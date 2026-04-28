import { AuthControllers } from "@/controllers";
import { upload } from "@/middlewares/multer";
import { buildProtectedRoute, buildRouter } from "@/utils/buildRouter";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * Protected Authentication Routes Router.
 *
 * This router manages authentication-related routes that require authorization,
 * such as logging out, fetching user details, and updating user information.
 */
const routes = [
  buildProtectedRoute(API_CONTRACT.LOGOUT, AuthControllers.logout),
  buildProtectedRoute(API_CONTRACT.GET_SELF, AuthControllers.getSelf),
  buildProtectedRoute(API_CONTRACT.UPDATE_SELF, AuthControllers.updateSelf, {
    extraMiddlewares: [upload.single("file")],
  }),
];

export default buildRouter(routes);

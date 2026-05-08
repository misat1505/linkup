import { AuthControllers } from "@/controllers";
import { authorizeWithRefreshToken } from "@/middlewares/authorize";
import { upload } from "@/middlewares/multer";
import { buildRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * Public Authentication Routes Router.
 *
 * This router handles authentication-related routes, including signup, login, and token refresh that doesn't require authorization via access token.
 */
const routes = [
  buildRoute(API_CONTRACT.SIGNUP, AuthControllers.signup, {
    extraMiddlewares: [upload.single("file")],
  }),
  buildRoute(API_CONTRACT.LOGIN, AuthControllers.login),
  buildRoute(API_CONTRACT.REFRESH_TOKEN, AuthControllers.refreshToken, {
    extraMiddlewares: [authorizeWithRefreshToken],
  }),
];

export default buildRouter(routes);

import { getSelfController } from "./get-self.controller";
import { loginController } from "./login.controller";
import { logoutController } from "./logout.controller";
import { refreshTokenController } from "./refresh-token.controller";
import { signupController } from "./signup.controller";
import { updateSelfController } from "./update-self.controller";

export const AuthControllers = {
  getSelf: getSelfController,
  login: loginController,
  logout: logoutController,
  refreshToken: refreshTokenController,
  signup: signupController,
  updateSelf: updateSelfController,
};

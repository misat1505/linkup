import { getSelfController } from "./getSelf.controller";
import { loginController } from "./login.controller";
import { logoutController } from "./logout.controller";
import { refreshTokenController } from "./refreshToken.controller";
import { signupController } from "./signup.controller";
import { updateSelfController } from "./updateSelf.controller";

export const AuthControllers = {
  getSelf: getSelfController,
  login: loginController,
  logout: logoutController,
  refreshToken: refreshTokenController,
  signup: signupController,
  updateSelf: updateSelfController,
};

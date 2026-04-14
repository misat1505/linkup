import { getSelfController } from "./getSelf.controller";
import { loginController } from "./login.controller";
import { logoutController } from "./logout.controller";
import { refreshTokenController } from "./refreshToken.controller";
import { signupController } from "./signup.controller";
import { updateSelfController } from "./updateSelf.controller";

export namespace AuthControllers {
  export const getSelf = getSelfController;
  export const login = loginController;
  export const logout = logoutController;
  export const refreshToken = refreshTokenController;
  export const signup = signupController;
  export const updateSelf = updateSelfController;
}

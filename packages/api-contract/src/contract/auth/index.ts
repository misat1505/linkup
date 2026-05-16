import { getSelfRoute } from "./get-self";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { refreshTokenRoute } from "./refresh-token";
import { signupRoute } from "./signup";
import { updateSelfRoute } from "./update-self";

export const authContract = {
	GET_SELF: getSelfRoute,
	LOGIN: loginRoute,
	LOGOUT: logoutRoute,
	REFRESH_TOKEN: refreshTokenRoute,
	SIGNUP: signupRoute,
	UPDATE_SELF: updateSelfRoute,
};

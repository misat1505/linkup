import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./GET_auth-user.spec";
import "./POST_auth-login.spec";
import "./POST_auth-logout.spec";
import "./POST_auth-refresh.spec";
import "./POST_auth-signup.spec";
import "./PUT_auth-user.spec";

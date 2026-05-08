import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./get_auth-user.spec";
import "./post_auth-login.spec";
import "./post_auth-logout.spec";
import "./post_auth-refresh.spec";
import "./post_auth-signup.spec";
import "./put_auth-user.spec";

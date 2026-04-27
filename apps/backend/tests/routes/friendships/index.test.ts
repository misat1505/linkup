import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./DELETE_friendships.spec";
import "./GET_friendships.spec";
import "./POST_friendships-accept.spec";
import "./POST_friendships.spec";

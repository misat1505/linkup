import { afterEach, vi } from "vitest";

afterEach(() => {
	vi.clearAllMocks();
});

import "./delete_friendships.spec";
import "./get_friendships.spec";
import "./post_friendships-accept.spec";
import "./post_friendships.spec";

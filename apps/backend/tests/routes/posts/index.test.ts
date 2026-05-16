import { afterEach, vi } from "vitest";

afterEach(() => {
	vi.clearAllMocks();
});

import "./delete_posts-id.spec";
import "./get_posts-id.spec";
import "./get_posts-mine.spec";
import "./get_posts.spec";
import "./post_posts-id-report.spec";
import "./post_posts.spec";
import "./put_posts-id.spec";

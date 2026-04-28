import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

import "./DELETE_posts-id.spec";
import "./GET_posts-id.spec";
import "./GET_posts-mine.spec";
import "./GET_posts.spec";
import "./POST_posts-id-report.spec";
import "./POST_posts.spec";
import "./PUT_posts-id.spec";

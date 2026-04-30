import { createPost as createPostController } from "./create-post";
import { deletePost as deletePostController } from "./delete-post";
import { getPost as getPostController } from "./get-post";
import { getPosts as getPostsController } from "./get-posts";
import { getUserPosts as getUserPostsController } from "./get-user-posts";
import { reportPost as reportPostController } from "./report-post";
import { updatePost as updatePostController } from "./update-post";

export const PostControllers = {
  createPost: createPostController,
  deletePost: deletePostController,
  getPost: getPostController,
  getPosts: getPostsController,
  getUserPosts: getUserPostsController,
  reportPost: reportPostController,
  updatePost: updatePostController,
};

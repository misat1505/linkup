import { createPost as createPostController } from "./createPost";
import { deletePost as deletePostController } from "./deletePost";
import { getPost as getPostController } from "./getPost";
import { getPosts as getPostsController } from "./getPosts";
import { getUserPosts as getUserPostsController } from "./getUserPosts";
import { reportPost as reportPostController } from "./reportPost";
import { updatePost as updatePostController } from "./updatePost";

export const PostControllers = {
  createPost: createPostController,
  deletePost: deletePostController,
  getPost: getPostController,
  getPosts: getPostsController,
  getUserPosts: getUserPostsController,
  reportPost: reportPostController,
  updatePost: updatePostController,
};

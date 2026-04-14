import { createPost as createPostController } from "./createPost";
import { deletePost as deletePostController } from "./deletePost";
import { getPost as getPostController } from "./getPost";
import { getPosts as getPostsController } from "./getPosts";
import { getUserPosts as getUserPostsController } from "./getUserPosts";
import { reportPost as reportPostController } from "./reportPost";
import { updatePost as updatePostController } from "./updatePost";

export namespace PostControllers {
  export const createPost = createPostController;
  export const deletePost = deletePostController;
  export const getPost = getPostController;
  export const getPosts = getPostsController;
  export const getUserPosts = getUserPostsController;
  export const reportPost = reportPostController;
  export const updatePost = updatePostController;
}

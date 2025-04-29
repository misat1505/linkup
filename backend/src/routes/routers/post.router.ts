import { Router } from "express";
import { PostControllers } from "../../controllers";
import { zodValidate } from "../../middlewares/validate";
import { PostId } from "../../validators/shared.validators";
import {
  CreatePostDTO,
  GetPostsQuery,
  UpdatePostDTO,
} from "../../validators/posts/posts.validators";

/**
 * Post Routes Router.
 *
 * This router handles operations related to posts, including creating, reading,
 * updating, and deleting posts, as well as retrieving posts specific to the user.
 */
const postRouter = Router();

postRouter.put(
  "/:id",
  zodValidate({ params: PostId, body: UpdatePostDTO }),
  PostControllers.updatePost
);
postRouter.get("/mine", PostControllers.getUserPosts);
postRouter.get(
  "/:id",
  zodValidate({ params: PostId }),
  PostControllers.getPost
);
postRouter.delete(
  "/:id",
  zodValidate({ params: PostId }),
  PostControllers.deletePost
);
postRouter.get(
  "/",
  zodValidate({ query: GetPostsQuery }),
  PostControllers.getPosts
);
postRouter.post(
  "/:id/report",
  zodValidate({ params: PostId }),
  PostControllers.reportPost
);
postRouter.post(
  "/",
  zodValidate({ body: CreatePostDTO }),
  PostControllers.createPost
);

export default postRouter;

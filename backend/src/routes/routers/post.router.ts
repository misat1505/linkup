import { Router } from "express";
import { PostControllers } from "../../controllers";
import { zodValidate } from "../../middlewares/validate";
import { PostId } from "../../validators/shared.validators";

/**
 * Post Routes Router.
 *
 * This router handles operations related to posts, including creating, reading,
 * updating, and deleting posts, as well as retrieving posts specific to the user.
 */
const postRouter = Router();

postRouter.put("/:id", PostControllers.updatePost);
postRouter.get("/mine", PostControllers.getUserPosts);
postRouter.get(
  "/:id",
  zodValidate({ params: PostId }),
  PostControllers.getPost
);
postRouter.delete("/:id", PostControllers.deletePost);
postRouter.get("/", PostControllers.getPosts);
postRouter.post("/:id/report", PostControllers.reportPost);
postRouter.post("/", PostControllers.createPost);

export default postRouter;

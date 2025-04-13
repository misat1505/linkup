import { Router } from "express";
import { updatePost } from "../../controllers/posts/updatePost";
import { getUserPosts } from "../../controllers/posts/getUserPosts";
import { getPost } from "../../controllers/posts/getPost";
import { getPosts } from "../../controllers/posts/getPosts";
import { createPost } from "../../controllers/posts/createPost";
import { deletePost } from "../../controllers/posts/deletePost";
import { reportPost } from "../../controllers/posts/reportPost";

/**
 * Post Routes Router.
 *
 * This router handles operations related to posts, including creating, reading,
 * updating, and deleting posts, as well as retrieving posts specific to the user.
 */
const postRouter = Router();

postRouter.put("/:id", updatePost);
postRouter.get("/mine", getUserPosts);
postRouter.get("/:id", getPost);
postRouter.delete("/:id", deletePost);
postRouter.get("/", getPosts);
postRouter.post("/:id/report", reportPost);
postRouter.post("/", createPost);

export default postRouter;

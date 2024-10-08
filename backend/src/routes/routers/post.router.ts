import { Router } from "express";
import { updatePost } from "../../controllers/posts/updatePost";
import { getUserPosts } from "../../controllers/posts/getUserPosts";
import { getPost } from "../../controllers/posts/getPost";
import { getPosts } from "../../controllers/posts/getPosts";
import { createPost } from "../../controllers/posts/createPost";
import { deletePost } from "../../controllers/posts/deletePost";

const postRouter = Router();

postRouter.put("/:id", updatePost);
postRouter.get("/mine", getUserPosts);
postRouter.get("/:id", getPost);
postRouter.delete("/:id", deletePost);
postRouter.get("/", getPosts);
postRouter.post("/", createPost);

export default postRouter;

import { Router } from "express";
import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "../../controllers/post.controller";

const postRouter = Router();

postRouter.put("/:id", updatePost);
postRouter.get("/mine", getUserPosts);
postRouter.get("/:id", getPost);
postRouter.get("/", getPosts);
postRouter.post("/", createPost);

export default postRouter;

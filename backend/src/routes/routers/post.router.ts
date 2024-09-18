import { Router } from "express";
import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
} from "../../controllers/post.controller";

const postRouter = Router();

postRouter.get("/mine", getUserPosts);
postRouter.get("/:id", getPost);
postRouter.get("/", getPosts);
postRouter.post("/", createPost);

export default postRouter;

import { Router } from "express";
import {
  createPost,
  getPosts,
  getUserPosts,
} from "../../controllers/post.controller";

const postRouter = Router();

postRouter.get("/mine", getUserPosts);
postRouter.get("/", getPosts);
postRouter.post("/", createPost);

export default postRouter;

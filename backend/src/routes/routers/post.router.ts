import { Router } from "express";
import { createPost, getPosts } from "../../controllers/post.controller";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", createPost);

export default postRouter;

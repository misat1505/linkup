import { Router } from "express";
import { createPost } from "../../controllers/post.controller";

const postRouter = Router();

postRouter.post("/", createPost);

export default postRouter;

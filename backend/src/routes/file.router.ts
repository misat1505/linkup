import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import { getFile } from "../controllers/file.controller";

const fileRouter = Router();

fileRouter.get("/:filename", authorize, getFile);

export default fileRouter;

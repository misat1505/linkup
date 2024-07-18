import { Router } from "express";
import { getFile } from "../../controllers/file.controller";

const fileRouter = Router();

fileRouter.get("/:filename", getFile);

export default fileRouter;

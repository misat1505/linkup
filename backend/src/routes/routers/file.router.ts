import { Router } from "express";
import { getFileController } from "../../controllers/file/getFile.controller";

const fileRouter = Router();

fileRouter.get("/:filename", getFileController);

export default fileRouter;

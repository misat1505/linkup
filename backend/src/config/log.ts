import { createStream } from "rotating-file-stream";
import path from "path";
import fs from "fs";

fs.mkdirSync(path.join(__dirname, "..", "..", "logs"), { recursive: true });

export const accessLogStream = createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "..", "..", "logs"),
});

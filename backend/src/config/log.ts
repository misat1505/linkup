import { createStream } from "rotating-file-stream";
import path from "path";
import fs from "fs";

fs.mkdirSync(path.join(__dirname, "..", "..", "logs"), { recursive: true });

/**
 * Creates a stream for logging access logs.
 *
 * @remarks
 * This stream writes access logs to a rotating file, where a new log file is created every 2 hours.
 * The logs are stored in the "logs" directory, which is created if it doesn't already exist.
 *
 * @source
 */
export const accessLogStream = createStream("access.log", {
  interval: "2h",
  path: path.join(__dirname, "..", "..", "logs"),
});

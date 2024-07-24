import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(
  path.join(__dirname, "security", "key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "security", "cert.crt"),
  "utf8"
);

export const credentials = { key: privateKey, cert: certificate };

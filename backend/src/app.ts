import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.router";
import { env } from "./config/env";
import { limiter } from "./config/rate-limiter";
import { corsConfig } from "./config/cors";
import { credentials } from "./config/https";
import https from "https";
import fileRouter from "./routes/file.router";

const app = express();

app.use(corsConfig);
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/files", fileRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

if (env.NODE_ENV !== "test") {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}.`);
  });
}

export default app;

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.router";
import { PORT } from "./constants";
import { limiter } from "./config/rate-limiter";
import { corsConfig } from "./config/cors";
import { credentials } from "./config/https";
import https from "https";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(corsConfig);
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static("static"));

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

if (process.env.NODE_ENV !== "test") {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

export default app;

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.router";
import { PORT } from "./constants";
import { limiter } from "./config/rate-limiter";
import { corsConfig } from "./config/cors";

const app = express();

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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

export default app;

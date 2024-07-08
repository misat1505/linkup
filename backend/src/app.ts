import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.router";
import { FRONTEND_URL, PORT } from "./constants";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
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

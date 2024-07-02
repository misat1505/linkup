import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.router";
import { PORT } from "./constants";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import { limiter } from "./config/rate-limiter";
import { corsConfig, corsMiddleware } from "./config/cors";
import { credentials } from "./config/https";
import https from "https";
import expressStatusMonitor from "express-status-monitor";
import protectedRoutes from "./routes/protected.routes";
import publicRoutes from "./routes/public.routes";
import morgan from "morgan";
import { accessLogStream } from "./config/log";
import { Server } from "socket.io";
import { setupSocket } from "./lib/sockets";

const app = express();

app.use(morgan("combined", { stream: accessLogStream }));
app.use(expressStatusMonitor());
app.use(corsMiddleware);
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", publicRoutes);
app.use("/", protectedRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

if (env.NODE_ENV !== "test") {
  const httpsServer = https.createServer(credentials, app);
  const io = new Server(env.SOCKET_PORT, {
    cors: corsConfig,
  });
  setupSocket(io);

  httpsServer.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}.`);
  });
}

export default app;

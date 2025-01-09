import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import { limiter } from "./config/rate-limiter";
import { corsConfig, corsMiddleware } from "./config/cors";
import http from "http";
import expressStatusMonitor from "express-status-monitor";
import protectedRoutes from "./routes/protected.routes";
import publicRoutes from "./routes/public.routes";
import morgan from "morgan";
import { accessLogStream } from "./config/log";
import { Server } from "socket.io";
import { setupSocket } from "./lib/sockets";
import { initReactions } from "./config/reactions";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./lib/swagger";
import { prisma } from "./lib/Prisma";

const app = express();

app.use(morgan("combined", { stream: accessLogStream }));
app.use(expressStatusMonitor());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/", publicRoutes);
app.use("/", protectedRoutes);

if (env.NODE_ENV !== "test") {
  initReactions();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: corsConfig,
  });

  setupSocket(io);

  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`Server and Socket are running on port ${env.PORT}.`);
  });
}

export default app;

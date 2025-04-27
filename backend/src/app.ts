import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import { corsMiddleware } from "./config/cors";
import { initReactions } from "./config/reactions";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./lib/swagger";
import { prisma } from "./lib/Prisma";
import i18next from "./i18n";
import middleware from "i18next-http-middleware";
import { initializeServices } from "./utils/initializeServices";
import { Routers } from "./routes";

const app = express();

app.services = initializeServices(prisma);

const isSentryActive = !!env.SENTRY_DSN;

if (isSentryActive) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  import("express-status-monitor").then(({ default: expressStatusMonitor }) => {
    app.use(expressStatusMonitor());
  });
}

app.use(corsMiddleware);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));

if (env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const users = await req.app.services.userService.getUserByLogin("login1");
    res.json(users);
  });
}

app.use("/", Routers.publicRoutes);
app.use("/", Routers.protectedRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== "test") console.error(err);
  if (isSentryActive) Sentry.captureException(err);
  return res.status(500).json({ message: err.message });
});

if (env.NODE_ENV !== "test") {
  initReactions();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}.`);
  });
}

export default app;

import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import middleware from "i18next-http-middleware";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { corsMiddleware } from "./config/cors";
import { env } from "./config/env";
import { initReactions } from "./config/reactions";
import i18next from "./i18n";
import { generateOpenApiDocument } from "./lib/openapi";
import { prisma } from "./lib/prisma";
import { Routers } from "./routes";
import { initializeServices } from "./utils/initialize-services";
import { initializeSocket } from "./utils/initialize-socket";

const app = express();

const server = http.createServer(app);

if (env.NODE_ENV !== "test") {
  app.use(morgan("tiny"));
  initializeSocket(server);
}

app.services = initializeServices(prisma);

const isSentryActive = !!env.SENTRY_DSN;
if (isSentryActive && env.NODE_ENV !== "test") {
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
  const spec = generateOpenApiDocument();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}

app.use("/", Routers.publicRoutes);
app.use("/", Routers.protectedRoutes);

app.get("/health", (_req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ status: ReasonPhrases.OK, timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (env.NODE_ENV !== "test") console.error(err);
  if (isSentryActive) Sentry.captureException(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

if (env.NODE_ENV !== "test") {
  initReactions();

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.PORT}.`);
  });
}

export default app;

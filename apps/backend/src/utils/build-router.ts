import { authorize } from "@/middlewares/authorize";
import { updateLastActive } from "@/middlewares/update-last-active";
import { validate } from "@/middlewares/validate";
import { RequestValidation } from "@/types/request-validation";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response, Router } from "express";

export type ContractRoute = (typeof API_CONTRACT)[keyof typeof API_CONTRACT];

function toExpressPath(path: string): string {
  return path.replace(/{([^}]+)}/g, ":$1");
}

function buildValidationMiddleware(route: ContractRoute) {
  const validations: RequestValidation = {};

  if ("request" in route) {
    const reqSchema = route.request;

    if ("params" in reqSchema) {
      validations.params = reqSchema.params;
    }

    if ("query" in reqSchema) {
      validations.query = reqSchema.query;
    }

    if ("body" in reqSchema) {
      const content = reqSchema.body.content;

      if ("application/json" in content) {
        validations.body = content["application/json"].schema;
      } else if ("multipart/form-data" in content) {
        validations.body = content["multipart/form-data"].schema;
      }
    }
  }

  return validate(validations);
}

type BuildRouteOptions = {
  extraMiddlewares?: Array<
    (req: Request, res: Response, next: NextFunction) => void
  >;
};

export function buildProtectedRoute(
  route: ContractRoute,
  handler: (req: Request, res: Response, next: NextFunction) => void,
  options?: BuildRouteOptions,
) {
  const middlewares = [
    authorize,
    updateLastActive,
    ...(options?.extraMiddlewares ?? []),
    buildValidationMiddleware(route),
  ];

  return {
    path: toExpressPath(route.path),
    method: route.method,
    handlers: [...middlewares, handler],
  };
}

export function buildRoute(
  route: ContractRoute,
  handler: (req: Request, res: Response, next: NextFunction) => void,
  options?: BuildRouteOptions,
) {
  const middlewares = [
    ...(options?.extraMiddlewares ?? []),
    buildValidationMiddleware(route),
  ];

  return {
    path: toExpressPath(route.path),
    method: route.method,
    handlers: [...middlewares, handler],
  };
}

export function buildRouter(routes: ReturnType<typeof buildProtectedRoute>[]) {
  const router = Router();

  for (const route of routes) {
    router[route.method](route.path, ...route.handlers);
  }

  return router;
}

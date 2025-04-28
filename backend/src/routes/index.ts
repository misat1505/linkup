import protectedRoutesImport from "./protected.routes";
import publicRoutesImport from "./public.routes";

export namespace Routers {
  export const protectedRoutes = protectedRoutesImport;
  export const publicRoutes = publicRoutesImport;
}

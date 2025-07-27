import { createRouteHandler } from "uploadthing/next";
import { multiMediaRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: multiMediaRouter,
});

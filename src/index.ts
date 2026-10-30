import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { wakatimeModule } from "./modules/routes";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
app.use(logger());
app.use(
  cors({
    allowMethods: ["GET"],
  })
);

app.doc("/openapi", {
  info: {
    description: "Normalized WakaTime coding statistics and summaries.",
    title: "Metrics API",
    version: "1.0.0",
  },
  openapi: "3.0.0",
  tags: [{ description: "Coding activity from WakaTime.", name: "WakaTime" }],
});
app.get("/doc", Scalar({ url: "/openapi" }));

app.route("/wakatime", wakatimeModule);

export default app;

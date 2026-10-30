import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import { wakatimeModule } from "./modules/routes";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
app.use(logger());
app.use(
  cors({
    allowMethods: ["GET"],
  })
);
app.use(
  rateLimiter<{ Bindings: CloudflareBindings }>({
    binding: (c) => c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  })
);
app.use(
  cache({
    cacheControl: "max-age=60",
    cacheName: "metrics-api",
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

import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { rateLimiter } from "hono-rate-limiter";
import { spotifyModule } from "./modules/spotify/route";
import { wakatimeModule } from "./modules/wakatime/routes";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
app.use(logger());
app.use(poweredBy());
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
  "/wakatime/*",
  cache({
    cacheControl: "max-age=3600",
    cacheName: "metrics-api-wakatime",
  })
);
app.use(
  "/spotify/*",
  cache({
    cacheControl: "max-age=60",
    cacheName: "metrics-api-spotify",
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
app.route("/spotify", spotifyModule);

export default app;

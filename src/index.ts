import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { rateLimiter } from "hono-rate-limiter";
import { spotifyModule } from "./modules/spotify/routes";
import { steamModule } from "./modules/steam/routes";
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
app.use(
  "/steam/*",
  cache({
    cacheControl: "max-age=3600",
    cacheName: "metrics-api-steam",
  })
);

app.doc("/openapi", {
  info: {
    description: "Normalized WakaTime coding statistics and summaries.",
    title: "Metrics API",
    version: "1.0.0",
  },
  openapi: "3.0.0",
  tags: [
    { description: "Coding activity from WakaTime.", name: "WakaTime" },
    { description: "Owned games from Steam.", name: "Steam" },
  ],
});
app.get("/doc", Scalar({ url: "/openapi" }));

app.route("/wakatime", wakatimeModule);
app.route("/spotify", spotifyModule);
app.route("/steam", steamModule);

export default app;

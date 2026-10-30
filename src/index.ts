import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { wakatimeModule } from "./modules/routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(logger());
app.use(
  cors({
    allowMethods: ["GET"],
  })
);

app.route("/wakatime", wakatimeModule);

export default app;

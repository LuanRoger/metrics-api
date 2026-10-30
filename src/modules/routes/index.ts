import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ServiceRequestError } from "@shared/errors";
import { responseErrorSchema } from "@shared/schemas";
import { getWakatimeFullStats } from "../use-cases";
import { wakatimeStatsSchema } from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

app.openapi(
  createRoute({
    method: "get",
    path: "/stats",
    responses: {
      200: {
        content: { "application/json": { schema: wakatimeStatsSchema } },
        description: "Wakatime statistics",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Wakatime request failed",
      },
    },
  }),
  async (c) => {
    try {
      const stats = await getWakatimeFullStats();

      return c.json(stats, 200);
    } catch (error) {
      if (error instanceof ServiceRequestError) {
        return c.json({ error: error.message }, 502);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({ error: "Unknown error" }, 500);
    }
  }
);

export const wakatimeModule = app;

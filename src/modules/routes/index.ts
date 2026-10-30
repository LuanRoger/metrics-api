import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  formatServiceError,
  formatValidationIssues,
} from "@shared/errors/utils";
import { responseErrorSchema } from "@shared/schemas";
import {
  getWakatimeAllTimeStats,
  getWakatimeFullStats,
  getWakatimeSummary,
} from "../use-cases";
import {
  wakatimeGetSummaryQuerySchema,
  wakatimeOverviewResponseSchema,
  wakatimeStatsResponseSchema,
  wakatimeSummaryResponseSchema,
} from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>({
  defaultHook: (result, c) => {
    if (result.success) {
      return result.data;
    }

    return c.json(
      {
        error: {
          code: "INVALID_REQUEST",
          details: formatValidationIssues(result.error),
          message: "The request is invalid.",
        },
      },
      400
    );
  },
});

app.openapi(
  createRoute({
    description: "WakaTime statistics.",
    method: "get",
    operationId: "getWakatimeStats",
    path: "/stats",
    responses: {
      200: {
        content: {
          "application/json": { schema: wakatimeStatsResponseSchema },
        },
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
    summary: "Get coding statistics",
    tags: ["WakaTime"],
  }),
  async (c) => {
    try {
      const stats = await getWakatimeFullStats();

      return c.json(stats, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description:
      "Returns daily coding activity and totals for the selected time range.",
    method: "get",
    operationId: "getWakatimeSummary",
    path: "/summary",
    request: { query: wakatimeGetSummaryQuerySchema },
    responses: {
      200: {
        content: {
          "application/json": { schema: wakatimeSummaryResponseSchema },
        },
        description: "Wakatime summary",
      },
      400: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Invalid query parameters",
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
    summary: "Get a coding activity summary",
    tags: ["WakaTime"],
  }),
  async (c) => {
    const { range } = c.req.valid("query");

    try {
      const summary = await getWakatimeSummary(range);

      return c.json(summary, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description: "Returns all-time coding totals.",
    method: "get",
    operationId: "getWakatimeOverview",
    path: "/overview",
    responses: {
      200: {
        content: {
          "application/json": { schema: wakatimeOverviewResponseSchema },
        },
        description: "All-time WakaTime overview",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "WakaTime request failed",
      },
    },
    summary: "Get all-time coding overview",
    tags: ["WakaTime"],
  }),
  async (c) => {
    try {
      const overview = await getWakatimeAllTimeStats();

      return c.json(overview, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

export const wakatimeModule = app;

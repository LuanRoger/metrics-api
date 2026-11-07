import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { formatServiceError } from "@/shared/errors/utils";
import { responseErrorSchema } from "@/shared/schemas";
import { getSteamGameAchievements, getSteamGames } from "../use-cases";
import {
  steamGameAchievementsParamsSchema,
  steamGameAchievementsResponseSchema,
  steamGamesResponseSchema,
} from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

app.openapi(
  createRoute({
    description: "Get owned games from Steam, ordered by most recently played.",
    method: "get",
    operationId: "getSteamGames",
    path: "/games",
    responses: {
      200: {
        content: { "application/json": { schema: steamGamesResponseSchema } },
        description: "Owned Steam games",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Steam returned an invalid response",
      },
    },
    summary: "Get owned Steam games",
    tags: ["Steam"],
  }),
  async (c) => {
    try {
      const games = await getSteamGames();
      const { success, data } = steamGamesResponseSchema.safeParse(games);
      if (!success) {
        return c.json(
          {
            error: {
              code: "INTERNAL_ERROR",
              message:
                "The Steam games response did not match the expected format.",
            },
          },
          500
        );
      }

      return c.json(data, 200);
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
    description: "Get achievements for a Steam game.",
    method: "get",
    operationId: "getSteamGameAchievements",
    path: "/games/:appId/achievements",
    request: { params: steamGameAchievementsParamsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: steamGameAchievementsResponseSchema,
          },
        },
        description: "Player achievements for the requested game",
      },
      400: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Invalid appId query parameter",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Steam returned an invalid response",
      },
    },
    summary: "Get Steam game achievements",
    tags: ["Steam"],
  }),
  async (c) => {
    const { appId } = c.req.valid("param");
    try {
      const response = await getSteamGameAchievements(appId);
      const { success, data } =
        steamGameAchievementsResponseSchema.safeParse(response);
      if (!success) {
        return c.json(
          {
            error: {
              code: "INTERNAL_ERROR",
              message:
                "The Steam achievements response did not match the expected format.",
            },
          },
          500
        );
      }

      return c.json(data, 200);
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

export const steamModule = app;

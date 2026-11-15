import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  formatServiceError,
  formatValidationIssues,
} from "@/shared/errors/utils";
import { responseErrorSchema } from "@/shared/schemas";
import {
  getGameProgress,
  getLastGamePlayed,
  getRetroachievementsUserProfile,
} from "../use-cases";
import {
  gameProgressParamsSchema,
  gameProgressResponseSchema,
  lastPlayedGameResponseSchema,
  userProfileResponseSchema,
} from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>({
  defaultHook: (result, c) => {
    if (!result.success) {
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
    }
  },
});

const errorResponses = {
  500: {
    content: { "application/json": { schema: responseErrorSchema } },
    description: "Unexpected internal error",
  },
  502: {
    content: { "application/json": { schema: responseErrorSchema } },
    description:
      "RetroAchievements request failed or returned an invalid response",
  },
};

app.openapi(
  createRoute({
    method: "get",
    operationId: "getRetroachievementsUserProfile",
    path: "/profile",
    responses: {
      200: {
        content: { "application/json": { schema: userProfileResponseSchema } },
        description: "RetroAchievements user profile",
      },
      ...errorResponses,
    },
    summary: "Get RetroAchievements profile",
    tags: ["RetroAchievements"],
  }),
  async (c) => {
    try {
      const profile = await getRetroachievementsUserProfile();
      return c.json(
        { ...profile, memberSince: profile.memberSince.toISOString() },
        200
      );
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
    method: "get",
    operationId: "getRetroachievementsLastPlayedGame",
    path: "/games/last-played",
    responses: {
      200: {
        content: {
          "application/json": { schema: lastPlayedGameResponseSchema },
        },
        description: "Most recently played game",
      },
      204: { description: "No recently played game is available" },
      ...errorResponses,
    },
    summary: "Get last played game",
    tags: ["RetroAchievements"],
  }),
  async (c) => {
    try {
      const game = await getLastGamePlayed();
      if (!game) {
        return c.body(null, 204);
      }
      return c.json(
        { ...game, lastPlayed: game.lastPlayed.toISOString() },
        200
      );
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
    method: "get",
    operationId: "getRetroachievementsGameProgress",
    path: "/games/{gameId}/progress",
    request: { params: gameProgressParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: gameProgressResponseSchema } },
        description: "Game progress and earned achievements",
      },
      400: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Invalid game ID",
      },
      ...errorResponses,
    },
    summary: "Get game progress",
    tags: ["RetroAchievements"],
  }),
  async (c) => {
    const { gameId } = c.req.valid("param");
    try {
      const progress = await getGameProgress(gameId);
      return c.json(
        {
          ...progress,
          achievements: progress.achievements.map((achievement) => ({
            ...achievement,
            dateEarned: achievement.dateEarned.toISOString(),
          })),
        },
        200
      );
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

export const retroachievementsModule = app;

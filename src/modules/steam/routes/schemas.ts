import { z } from "@hono/zod-openapi";
import { steamGameSchema, steamPlayerStatsResponseSchema } from "../schemas";

export const steamGamesResponseSchema = z
  .array(steamGameSchema)
  .openapi("SteamOwnedGames");

export const steamGameAchievementsParamsSchema = z.object({
  appId: z.coerce
    .number()
    .int()
    .positive()
    .openapi({
      description: "Steam application ID to retrieve achievements for.",
      example: 730,
      param: { in: "query", name: "appId" },
    }),
});

export const steamGameAchievementsResponseSchema =
  steamPlayerStatsResponseSchema.openapi("SteamGameAchievementsResponse");

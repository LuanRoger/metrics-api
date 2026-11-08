import { z } from "@hono/zod-openapi";
import {
  steamGameAchievementsResponseSchema as steamGameAchievementsResponseSchemaBase,
  steamGameSchema,
  steamGameSchemaResponseSchema as steamGameSchemaResponseSchemaBase,
} from "../schemas";

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
      param: { in: "path", name: "appId" },
    }),
});

export const steamGameAchievementsResponseSchema =
  steamGameAchievementsResponseSchemaBase.openapi(
    "SteamGameAchievementsResponse"
  );

export const steamGameSchemaParamsSchema = z.object({
  appId: z.coerce
    .number()
    .int()
    .positive()
    .openapi({
      description: "Steam application ID to retrieve schema information for.",
      example: 730,
      param: { in: "path", name: "appId" },
    }),
});

export const steamGameSchemaResponseSchema =
  steamGameSchemaResponseSchemaBase.openapi("SteamGameSchemaResponse");

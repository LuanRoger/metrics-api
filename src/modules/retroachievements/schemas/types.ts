import type { z } from "@hono/zod-openapi";
import type {
  retroachievementsGameProgressApiResponseSchema,
  retroachievementsGameProgressSchema,
  retroachievementsLastPlayedGameSchema,
  retroachievementsRecentlyPlayedGamesApiResponseSchema,
  retroachievementsUserProfileApiResponseSchema,
  retroachievementsUserProfileSchema,
} from "./index";

export type RetroachievementsGameProgressApiResponse = z.infer<
  typeof retroachievementsGameProgressApiResponseSchema
>;
export type RetroachievementsGameProgress = z.infer<
  typeof retroachievementsGameProgressSchema
>;

export type RetroachievementsRecentlyPlayedGamesApiResponse = z.infer<
  typeof retroachievementsRecentlyPlayedGamesApiResponseSchema
>;
export type LastPlayedGame = z.infer<
  typeof retroachievementsLastPlayedGameSchema
>;

export type RetroachievementsUserProfileApiResponse = z.infer<
  typeof retroachievementsUserProfileApiResponseSchema
>;
export type RetroachievementsUserProfile = z.infer<
  typeof retroachievementsUserProfileSchema
>;

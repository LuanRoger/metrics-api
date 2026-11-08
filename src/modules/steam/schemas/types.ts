import type { z } from "zod";
import type {
  steamAvailableGameStatsSchema,
  steamGameAchievementSchema,
  steamGameAchievementsResponseSchema,
  steamGameDetailsSchema,
  steamGameSchema,
  steamGameSchemaApiResponseSchema,
  steamGameSchemaResponseSchema,
  steamGameStatSchema,
  steamGamesResponseSchema,
  steamOwnedGamesApiResponseSchema,
  steamPlayerAchievementSchema,
  steamPlayerStatsAchievementsApiResponseSchema,
  steamPlayerStatsSchema,
} from "./index";

export type SteamOwnedGamesApiResponse = z.infer<
  typeof steamOwnedGamesApiResponseSchema
>;
export type SteamGame = z.infer<typeof steamGameSchema>;
export type SteamGamesResponse = z.infer<typeof steamGamesResponseSchema>;
export type SteamPlayerAchievement = z.infer<
  typeof steamPlayerAchievementSchema
>;
export type SteamPlayerStats = z.infer<typeof steamPlayerStatsSchema>;
export type SteamPlayerStatsAchievementsApiResponse = z.infer<
  typeof steamPlayerStatsAchievementsApiResponseSchema
>;
export type SteamGameAchievementsResponse = z.infer<
  typeof steamGameAchievementsResponseSchema
>;
export type SteamGameStat = z.infer<typeof steamGameStatSchema>;
export type SteamGameAchievement = z.infer<typeof steamGameAchievementSchema>;
export type SteamAvailableGameStats = z.infer<
  typeof steamAvailableGameStatsSchema
>;
export type SteamGameSchemaApiResponse = z.infer<
  typeof steamGameSchemaApiResponseSchema
>;
export type SteamGameSchema = z.infer<typeof steamGameDetailsSchema>;
export type SteamGameSchemaResponse = z.infer<
  typeof steamGameSchemaResponseSchema
>;

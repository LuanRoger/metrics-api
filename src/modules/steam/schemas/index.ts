import { z } from "@hono/zod-openapi";

const steamOwnedGameApiSchema = z.object({
  appid: z.number(),
  content_descriptorids: z.array(z.number()).default([]),
  has_community_visible_stats: z.boolean().optional(),
  img_icon_url: z.string(),
  name: z.string(),
  playtime_deck_forever: z.number(),
  playtime_disconnected: z.number(),
  playtime_forever: z.number(),
  playtime_linux_forever: z.number(),
  playtime_mac_forever: z.number(),
  playtime_windows_forever: z.number(),
  rtime_last_played: z.number(),
});

export const steamOwnedGamesApiResponseSchema = z
  .object({
    response: z.object({
      game_count: z.number(),
      games: z.array(steamOwnedGameApiSchema),
    }),
  })
  .openapi("SteamOwnedGamesApiResponse");

export const steamGameSchema = z
  .object({
    appId: z.number().openapi({ example: 730 }),
    contentDescriptorIds: z.array(z.number()),
    hasCommunityVisibleStats: z.boolean(),
    imgIconUrl: z.string(),
    name: z.string().openapi({ example: "Counter-Strike 2" }),
    playtimeDeckForever: z.number(),
    playtimeDisconnected: z.number(),
    playtimeForever: z.number(),
    playtimeLinuxForever: z.number(),
    playtimeMacForever: z.number(),
    playtimeWindowsForever: z.number(),
    rtimeLastPlayed: z.number(),
  })
  .openapi("SteamGame");

export const steamGamesResponseSchema = z
  .object({
    gameCount: z.number(),
    games: z.array(steamGameSchema),
  })
  .openapi("SteamGamesResponse");

export const steamPlayerAchievementSchema = z
  .object({
    achieved: z.number(),
    apiname: z.string(),
    description: z.string(),
    name: z.string(),
    unlocktime: z.number(),
  })
  .openapi("SteamPlayerAchievement");

export const steamPlayerStatsSchema = z
  .object({
    achievements: z.array(steamPlayerAchievementSchema),
    gameName: z.string(),
    steamID: z.string(),
  })
  .openapi("SteamPlayerStats");

export const steamPlayerStatsResponseSchema = z
  .object({
    playerstats: steamPlayerStatsSchema,
  })
  .openapi("SteamPlayerStatsResponse");

export const steamPlayerStatsAchievementsApiResponseSchema = z
  .object({
    playerstats: z.object({
      achievements: z.array(
        z.object({
          achieved: z.number(),
          apiname: z.string(),
          description: z.string(),
          name: z.string(),
          unlocktime: z.number(),
        })
      ),
      gameName: z.string(),
      steamID: z.string(),
    }),
  })
  .openapi("SteamPlayerStatsApiResponse");

export const steamGameStatSchema = z
  .object({
    defaultvalue: z.number(),
    displayName: z.string(),
    name: z.string(),
  })
  .openapi("SteamGameStat");

export const steamGameAchievementSchema = z
  .object({
    defaultvalue: z.number(),
    description: z.string(),
    displayName: z.string(),
    hidden: z.number(),
    icon: z.string(),
    icongray: z.string(),
    name: z.string(),
  })
  .openapi("SteamGameAchievement");

export const steamAvailableGameStatsSchema = z
  .object({
    achievements: z.array(steamGameAchievementSchema),
    stats: z.array(steamGameStatSchema),
  })
  .openapi("SteamAvailableGameStats");

export const steamGameDetailsSchema = z
  .object({
    availableGameStats: steamAvailableGameStatsSchema,
    gameName: z.string(),
    gameVersion: z.string(),
  })
  .openapi("SteamGameDetails");

export const steamGameSchemaResponseSchema = z
  .object({
    game: steamGameDetailsSchema,
  })
  .openapi("SteamGameSchemaResponse");

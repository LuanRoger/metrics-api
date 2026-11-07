import type {
  SteamGamesResponse,
  SteamOwnedGamesApiResponse,
  SteamPlayerStatsAchievementsApiResponse,
  SteamPlayerStatsResponse,
} from "./types";

export function adaptPlayerStatsResponseToSteamPlayerStatsResponse(
  response: SteamPlayerStatsAchievementsApiResponse
): SteamPlayerStatsResponse {
  const { playerstats } = response;

  return {
    playerstats: {
      achievements: playerstats.achievements.map((achievement) => ({
        achieved: achievement.achieved,
        apiname: achievement.apiname,
        description: achievement.description,
        name: achievement.name,
        unlocktime: achievement.unlocktime,
      })),
      gameName: playerstats.gameName,
      steamID: playerstats.steamID,
    },
  };
}

export function adaptOwnedGamesResponseToSteamGamesResponse(
  response: SteamOwnedGamesApiResponse
): SteamGamesResponse {
  const innerResponse = response.response;

  return {
    gameCount: innerResponse.game_count,
    games: innerResponse.games.map((game) => ({
      appId: game.appid,
      contentDescriptorIds: game.content_descriptorids,
      hasCommunityVisibleStats: game.has_community_visible_stats ?? false,
      imgIconUrl: game.img_icon_url,
      name: game.name,
      playtimeDeckForever: game.playtime_deck_forever,
      playtimeDisconnected: game.playtime_disconnected,
      playtimeForever: game.playtime_forever,
      playtimeLinuxForever: game.playtime_linux_forever,
      playtimeMacForever: game.playtime_mac_forever,
      playtimeWindowsForever: game.playtime_windows_forever,
      rtimeLastPlayed: game.rtime_last_played,
    })),
  };
}

import type {
  SteamGameAchievementsResponse,
  SteamGamesResponse,
  SteamOwnedGamesApiResponse,
  SteamPlayerStatsAchievementsApiResponse,
} from "./types";

export function adaptPlayerStatsResponseToSteamPlayerStatsResponse(
  response: SteamPlayerStatsAchievementsApiResponse
): SteamGameAchievementsResponse {
  const { playerstats } = response;

  return playerstats.achievements.map((achievement) => ({
    achieved: achievement.achieved,
    apiname: achievement.apiname,
    description: achievement.description,
    name: achievement.name,
    unlocktime: achievement.unlocktime,
  }));
}

export function adaptOwnedGamesResponseToSteamGamesResponse(
  response: SteamOwnedGamesApiResponse
): SteamGamesResponse {
  const innerResponse = response.response;

  return {
    gameCount: innerResponse.game_count,
    games: innerResponse.games.map(
      ({
        appid,
        content_descriptorids,
        has_community_visible_stats,
        img_icon_url,
        name,
        playtime_deck_forever,
        playtime_disconnected,
        playtime_forever,
        playtime_linux_forever,
        playtime_mac_forever,
        playtime_windows_forever,
        rtime_last_played,
      }) => ({
        appId: appid,
        contentDescriptorIds: content_descriptorids,
        hasCommunityVisibleStats: has_community_visible_stats ?? false,
        imgIconUrl: img_icon_url,
        name,
        playtimeDeckForever: playtime_deck_forever,
        playtimeDisconnected: playtime_disconnected,
        playtimeForever: Math.ceil(playtime_forever / 60),
        playtimeLinuxForever: Math.ceil(playtime_linux_forever / 60),
        playtimeMacForever: Math.ceil(playtime_mac_forever / 60),
        playtimeWindowsForever: Math.ceil(playtime_windows_forever / 60),
        rtimeLastPlayed: rtime_last_played,
      })
    ),
  };
}

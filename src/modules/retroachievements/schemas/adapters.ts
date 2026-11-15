import type {
  LastPlayedGame,
  RetroachievementsGameProgress,
  RetroachievementsGameProgressApiResponse,
  RetroachievementsRecentlyPlayedGamesApiResponse,
  RetroachievementsUserProfile,
  RetroachievementsUserProfileApiResponse,
} from "./types";

export function adaptRetroachievementsUserProfileResponseToUserProfile(
  response: RetroachievementsUserProfileApiResponse,
  retroachievementsBaseUrl: string
): RetroachievementsUserProfile {
  return {
    contribCount: response.ContribCount,
    contribYield: response.ContribYield,
    id: response.ID,
    lastGameId: response.LastGameID,
    memberSince: new Date(`${response.MemberSince.replace(" ", "T")}Z`),
    motto: response.Motto,
    permissions: response.Permissions,
    richPresenceMsg: response.RichPresenceMsg,
    totalPoints: response.TotalPoints,
    totalSoftcorePoints: response.TotalSoftcorePoints,
    totalTruePoints: response.TotalTruePoints,
    ulid: response.ULID,
    untracked: response.Untracked,
    user: response.User,
    userPic: new URL(response.UserPic, retroachievementsBaseUrl).toString(),
    userWallActive: response.UserWallActive,
  };
}

export function adaptLastPlayedGameResponseToLastPlayedGame(
  response: RetroachievementsRecentlyPlayedGamesApiResponse[number],
  retroachievementsBaseUrl: string
): LastPlayedGame {
  return {
    achievementsTotal: response.AchievementsTotal,
    consoleId: response.ConsoleID,
    consoleName: response.ConsoleName,
    gameId: response.GameID,
    imageBoxArt: new URL(
      response.ImageBoxArt,
      retroachievementsBaseUrl
    ).toString(),
    imageIcon: new URL(response.ImageIcon, retroachievementsBaseUrl).toString(),
    imageIngame: new URL(
      response.ImageIngame,
      retroachievementsBaseUrl
    ).toString(),
    imageTitle: new URL(
      response.ImageTitle,
      retroachievementsBaseUrl
    ).toString(),
    lastPlayed: new Date(`${response.LastPlayed.replace(" ", "T")}Z`),
    numAchieved: response.NumAchieved,
    numAchievedHardcore: response.NumAchievedHardcore,
    numPossibleAchievements: response.NumPossibleAchievements,
    possibleScore: response.PossibleScore,
    scoreAchieved: response.ScoreAchieved,
    scoreAchievedHardcore: response.ScoreAchievedHardcore,
    title: response.Title,
  };
}

export function adaptGameProgressResponseToGameProgress(
  response: RetroachievementsGameProgressApiResponse,
  retroachievementsMediaUrl: string
): RetroachievementsGameProgress {
  const achievements: RetroachievementsGameProgress["achievements"] = [];
  for (const achievement of Object.values(response.Achievements)) {
    if (!achievement.DateEarned) {
      continue;
    }
    achievements.push({
      badgeImageUrl: `${retroachievementsMediaUrl.endsWith("/") ? retroachievementsMediaUrl.slice(0, -1) : retroachievementsMediaUrl}/Badge/${achievement.BadgeName}.png`,
      badgeName: achievement.BadgeName,
      dateEarned: new Date(`${achievement.DateEarned.replace(" ", "T")}Z`),
      description: achievement.Description,
      id: achievement.ID,
      points: achievement.Points,
      title: achievement.Title,
    });
  }
  achievements.sort((a, b) => b.dateEarned.getTime() - a.dateEarned.getTime());

  return {
    achievements,
    id: response.ID,
    numAchievementsTotal: response.NumAchievements,
    numAwardedToUser: response.NumAwardedToUser,
    title: response.Title,
    userCompletion: response.UserCompletion,
  };
}

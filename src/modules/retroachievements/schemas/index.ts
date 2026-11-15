import { z } from "@hono/zod-openapi";

export const retroachievementsUserProfileApiResponseSchema = z
  .object({
    ContribCount: z.number(),
    ContribYield: z.number(),
    ID: z.number(),
    LastGameID: z.number(),
    MemberSince: z
      .string()
      .refine(
        (value) =>
          z.iso.datetime().safeParse(`${value.replace(" ", "T")}Z`).success,
        "Expected a UTC date and time"
      ),
    Motto: z.string(),
    Permissions: z.number(),
    RichPresenceMsg: z.string(),
    TotalPoints: z.number(),
    TotalSoftcorePoints: z.number(),
    TotalTruePoints: z.number(),
    ULID: z.string(),
    Untracked: z.number(),
    User: z.string(),
    UserPic: z.string(),
    UserWallActive: z.number(),
  })
  .openapi("RetroachievementsUserProfileApiResponse");

export const retroachievementsUserProfileSchema = z
  .object({
    contribCount: z.number(),
    contribYield: z.number(),
    id: z.number(),
    lastGameId: z.number(),
    memberSince: z.date(),
    motto: z.string(),
    permissions: z.number(),
    richPresenceMsg: z.string(),
    totalPoints: z.number(),
    totalSoftcorePoints: z.number(),
    totalTruePoints: z.number(),
    ulid: z.string(),
    untracked: z.number(),
    user: z.string(),
    userPic: z.string(),
    userWallActive: z.number(),
  })
  .openapi("RetroachievementsUserProfile");

const retroachievementsRecentlyPlayedGameApiSchema = z.object({
  AchievementsTotal: z.number(),
  ConsoleID: z.number(),
  ConsoleName: z.string(),
  GameID: z.number(),
  ImageBoxArt: z.string(),
  ImageIcon: z.string(),
  ImageIngame: z.string(),
  ImageTitle: z.string(),
  LastPlayed: z
    .string()
    .refine(
      (value) =>
        z.iso.datetime().safeParse(`${value.replace(" ", "T")}Z`).success,
      "Expected a UTC date and time"
    ),
  NumAchieved: z.number(),
  NumAchievedHardcore: z.number(),
  NumPossibleAchievements: z.number(),
  PossibleScore: z.number(),
  ScoreAchieved: z.number(),
  ScoreAchievedHardcore: z.number(),
  Title: z.string(),
});

export const retroachievementsRecentlyPlayedGamesApiResponseSchema = z
  .array(retroachievementsRecentlyPlayedGameApiSchema)
  .openapi("RetroachievementsRecentlyPlayedGamesApiResponse");

export const retroachievementsLastPlayedGameSchema = z
  .object({
    achievementsTotal: z.number(),
    consoleId: z.number(),
    consoleName: z.string(),
    gameId: z.number(),
    imageBoxArt: z.string(),
    imageIcon: z.string(),
    imageIngame: z.string(),
    imageTitle: z.string(),
    lastPlayed: z.date(),
    numAchieved: z.number(),
    numAchievedHardcore: z.number(),
    numPossibleAchievements: z.number(),
    possibleScore: z.number(),
    scoreAchieved: z.number(),
    scoreAchievedHardcore: z.number(),
    title: z.string(),
  })
  .openapi("RetroachievementsLastPlayedGame");

const retroachievementsAchievementApiSchema = z.object({
  BadgeName: z.string(),
  DateEarned: z
    .string()
    .refine(
      (value) =>
        z.iso.datetime().safeParse(`${value.replace(" ", "T")}Z`).success,
      "Expected a UTC date and time"
    )
    .nullish(),
  Description: z.string(),
  ID: z.number(),
  Points: z.number(),
  Title: z.string(),
});

export const retroachievementsGameProgressApiResponseSchema = z
  .object({
    Achievements: z.union([
      z.record(z.string(), retroachievementsAchievementApiSchema),
      z.array(retroachievementsAchievementApiSchema).max(0),
    ]),
    ID: z.number(),
    NumAchievements: z.number(),
    NumAwardedToUser: z.number(),
    Title: z.string(),
    UserCompletion: z.string(),
  })
  .openapi("RetroachievementsGameProgressApiResponse");

export const retroachievementsAchievementSchema = z
  .object({
    badgeImageUrl: z.string(),
    badgeName: z.string(),
    dateEarned: z.date(),
    description: z.string(),
    id: z.number(),
    points: z.number(),
    title: z.string(),
  })
  .openapi("RetroachievementsAchievement");

export const retroachievementsGameProgressSchema = z
  .object({
    achievements: z.array(retroachievementsAchievementSchema),
    id: z.number(),
    numAchievementsTotal: z.number(),
    numAwardedToUser: z.number(),
    title: z.string(),
    userCompletion: z.string(),
  })
  .openapi("RetroachievementsGameProgress");

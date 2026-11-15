import { ENV } from "varlock/env";
import {
  ServiceRequestError,
  UnexpectedServiceResponseParseError,
} from "@/shared/errors";
import {
  retroachievementsGameProgressApiResponseSchema,
  retroachievementsRecentlyPlayedGamesApiResponseSchema,
  retroachievementsUserProfileApiResponseSchema,
} from "../schemas";
import {
  adaptGameProgressResponseToGameProgress,
  adaptLastPlayedGameResponseToLastPlayedGame,
  adaptRetroachievementsUserProfileResponseToUserProfile,
} from "../schemas/adapters";
import { parseRetroachievementsJson } from "../utils";

export async function getRetroachievementsUserProfile() {
  const {
    RETROACHIEVEMENTS_API_URL: apiUrl,
    RETROACHIEVEMENTS_USERNAME: username,
    RETROACHIEVEMENTS_API_KEY: apiKey,
    RETROACHIEVEMENTS_BASE_URL: baseUrl,
  } = ENV;

  const params = new URLSearchParams({ u: username, y: apiKey });
  const response = await fetch(
    `${apiUrl}/API_GetUserProfile.php?${params}`
  ).catch((requestError: unknown) => {
    throw new ServiceRequestError("RetroAchievements", requestError);
  });
  const parsedResponse = await parseRetroachievementsJson(response);
  const { success, data, error } =
    await retroachievementsUserProfileApiResponseSchema.safeParseAsync(
      parsedResponse
    );
  if (!success) {
    throw new UnexpectedServiceResponseParseError("RetroAchievements", error);
  }

  return adaptRetroachievementsUserProfileResponseToUserProfile(data, baseUrl);
}

export async function getLastGamePlayed() {
  const {
    RETROACHIEVEMENTS_API_URL: apiUrl,
    RETROACHIEVEMENTS_USERNAME: username,
    RETROACHIEVEMENTS_API_KEY: apiKey,
    RETROACHIEVEMENTS_BASE_URL: baseUrl,
  } = ENV;

  const params = new URLSearchParams({ c: "1", u: username, y: apiKey });
  const response = await fetch(
    `${apiUrl}/API_GetUserRecentlyPlayedGames.php?${params}`
  ).catch((requestError: unknown) => {
    throw new ServiceRequestError("RetroAchievements", requestError);
  });
  const parsedResponse = await parseRetroachievementsJson(response);
  const { success, data, error } =
    await retroachievementsRecentlyPlayedGamesApiResponseSchema.safeParseAsync(
      parsedResponse
    );
  if (!success) {
    throw new UnexpectedServiceResponseParseError("RetroAchievements", error);
  }

  const [game] = data;
  return game
    ? adaptLastPlayedGameResponseToLastPlayedGame(game, baseUrl)
    : null;
}

export async function getGameProgress(gameId: string) {
  const {
    RETROACHIEVEMENTS_API_URL: apiUrl,
    RETROACHIEVEMENTS_USERNAME: username,
    RETROACHIEVEMENTS_API_KEY: apiKey,
    RETROACHIEVEMENTS_MEDIA_URL: mediaUrl,
  } = ENV;

  const params = new URLSearchParams({ g: gameId, u: username, y: apiKey });
  const response = await fetch(
    `${apiUrl}/API_GetGameInfoAndUserProgress.php?${params}`
  ).catch((requestError: unknown) => {
    throw new ServiceRequestError("RetroAchievements", requestError);
  });
  const parsedResponse = await parseRetroachievementsJson(response);
  const { success, data, error } =
    await retroachievementsGameProgressApiResponseSchema.safeParseAsync(
      parsedResponse
    );
  if (!success) {
    throw new UnexpectedServiceResponseParseError("RetroAchievements", error);
  }

  return adaptGameProgressResponseToGameProgress(data, mediaUrl);
}

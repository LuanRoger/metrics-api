import { ENV } from "varlock/env";
import { UnexpectedServiceResponseParseError } from "@/shared/errors";
import {
  steamOwnedGamesApiResponseSchema,
  steamPlayerStatsAchievementsApiResponseSchema,
} from "../schemas";
import {
  adaptOwnedGamesResponseToSteamGamesResponse,
  adaptPlayerStatsResponseToSteamPlayerStatsResponse,
} from "../schemas/adapters";

export async function getSteamGames() {
  const {
    STEAM_API_KEY: apiKey,
    STEAM_ID: steamId,
    STEAM_BASE_URL: baseUrl,
  } = ENV;

  const url = `${baseUrl}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&format=json`;

  const response = await fetch(url);
  const jsonResponse: unknown = await response.json();
  const { success, data, error } =
    await steamOwnedGamesApiResponseSchema.safeParseAsync(jsonResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Steam", error);
  }

  const { games } = adaptOwnedGamesResponseToSteamGamesResponse(data);
  const sortedGames = games.sort(
    (first, second) => second.rtimeLastPlayed - first.rtimeLastPlayed
  );

  return sortedGames;
}

export async function getSteamGameAchievements(appId: number) {
  const {
    STEAM_API_KEY: apiKey,
    STEAM_ID: steamId,
    STEAM_BASE_URL: baseUrl,
  } = ENV;

  const url = `${baseUrl}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${steamId}&format=json&l=en`;

  const response = await fetch(url);
  const jsonResponse: unknown = await response.json();
  const { success, data, error } =
    await steamPlayerStatsAchievementsApiResponseSchema.safeParseAsync(jsonResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Steam", error);
  }

  return adaptPlayerStatsResponseToSteamPlayerStatsResponse(data);
}

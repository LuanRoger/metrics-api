import { ENV } from "varlock/env";
import { UnexpectedServiceResponseParseError } from "@/shared/errors";
import {
  spotifyCurrentPlayingResponseSchema,
  spotifyRecentlyPlayedResponseSchema,
  spotifyTokenResponseSchema,
} from "../schemas";
import {
  adaptCurrentPlayingReponseToSpotifyCurrentPlayingTrackInfo,
  adaptRecentlyPlayedTrackResponseToSpotifyTrackingInfo,
} from "../schemas/adapters";
import { parseSpotifyJson } from "../utils";

async function getSpotifyAccessToken() {
  const {
    SPOTIFY_CLIENT_ID: clientId,
    SPOTIFY_CLIENT_SECRET: clientSecret,
    SPOTIFY_REFRESH_TOKEN: refreshToken,
  } = ENV;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const parsedResponse = await parseSpotifyJson(response);

  const { success, data, error } =
    await spotifyTokenResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Spotify", error);
  }

  return data;
}

export async function getSpotifyRecentlyPlayed() {
  const { access_token: accessToken } = await getSpotifyAccessToken();
  const timestamp = Date.now() - 10 * 60 * 60 * 1000;

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?after=${timestamp}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const parsedResponse = await parseSpotifyJson(response);

  const { success, data, error } =
    await spotifyRecentlyPlayedResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Spotify", error);
  }

  const trackInfo = adaptRecentlyPlayedTrackResponseToSpotifyTrackingInfo(data);

  return trackInfo;
}

export async function getCurrentPlayingTrack() {
  const { access_token: accessToken } = await getSpotifyAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.status === 204) {
    return null;
  }
  const parsedResponse = await parseSpotifyJson(response);

  const { success, data, error } =
    await spotifyCurrentPlayingResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Spotify", error);
  }

  const trackInfo =
    adaptCurrentPlayingReponseToSpotifyCurrentPlayingTrackInfo(data);

  return trackInfo;
}

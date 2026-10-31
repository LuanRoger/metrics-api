import type z from "zod";
import type {
  spotifyCurrentPlayingResponseSchema,
  spotifyRecentlyPlayedResponseSchema,
  spotifyTokenResponseSchema,
} from "./index";

export type SpotifyTokenResponse = z.infer<typeof spotifyTokenResponseSchema>;
export type SpotifyRecentlyPlayed = z.infer<
  typeof spotifyRecentlyPlayedResponseSchema
>;
export type SpotifyCurrentPlaying = z.infer<
  typeof spotifyCurrentPlayingResponseSchema
>;

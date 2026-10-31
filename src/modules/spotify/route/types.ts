import type z from "zod";
import type {
  recentlyPlayedResponseSchema,
  spotifyCurrentPlayingSchema,
} from "./schemas";

export type SpotifyRecentlyPlayed = z.infer<
  typeof recentlyPlayedResponseSchema
>;
export type SpotifyCurrentPlaying = z.infer<typeof spotifyCurrentPlayingSchema>;

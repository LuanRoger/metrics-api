import type z from "zod";
import type { spotifyCurrentPlayingSchema } from "./schemas";

export type SpotifyCurrentPlaying = z.infer<typeof spotifyCurrentPlayingSchema>;

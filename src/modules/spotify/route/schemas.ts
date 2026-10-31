import { z } from "@hono/zod-openapi";

export const spotifyCurrentPlayingSchema = z
  .object({
    artists: z.array(z.string()),
    href: z.url(),
    image: z
      .object({
        height: z.number(),
        url: z.url(),
        width: z.number(),
      })
      .optional(),
    isPlaying: z.boolean(),
    name: z.string(),
    progressMs: z.number().nullable(),
    timestamp: z.number(),
  })
  .openapi("SpotifyCurrentPlaying");

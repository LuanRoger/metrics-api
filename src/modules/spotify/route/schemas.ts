import { z } from "@hono/zod-openapi";

export const recentlyPlayedResponseSchema = z
  .array(
    z.object({
      artists: z.array(z.object({ href: z.url(), name: z.string() })),
      image: z
        .object({
          height: z.number(),
          url: z.url(),
          width: z.number(),
        })
        .optional(),
      name: z.string(),
    })
  )
  .openapi("SpotifyRecentlyPlayed");

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

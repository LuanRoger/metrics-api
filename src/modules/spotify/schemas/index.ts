import z from "zod";

const spotifyArtistSchema = z.object({
  href: z.url(),
  name: z.string(),
});

const spotifyTrackSchema = z.object({
  album: z.object({
    images: z.array(
      z.object({
        height: z.number(),
        url: z.url(),
        width: z.number(),
      })
    ),
  }),
  artists: z.array(spotifyArtistSchema),
  name: z.string(),
});

export const spotifyTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

export const spotifyRecentlyPlayedResponseSchema = z.object({
  items: z.array(
    z.object({
      track: spotifyTrackSchema,
    })
  ),
});

export const spotifyCurrentPlayingResponseSchema = z.object({
  is_playing: z.boolean(),
  item: spotifyTrackSchema.extend({
    album: spotifyTrackSchema.shape.album.extend({
      artists: z.array(spotifyArtistSchema),
    }),
    external_urls: z.object({ spotify: z.url() }),
  }),
  progress_ms: z.number(),
  timestamp: z.number(),
});

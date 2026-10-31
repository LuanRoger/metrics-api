import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { formatServiceError } from "@/shared/errors/utils";
import { responseErrorSchema } from "@/shared/schemas";
import { getCurrentPlayingTrack, getSpotifyRecentlyPlayed } from "../use-cases";
import {
  recentlyPlayedResponseSchema,
  spotifyCurrentPlayingSchema,
} from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

app.openapi(
  createRoute({
    description:
      "Returns tracks played by the authenticated Spotify user in approximately the last 10 hours.",
    method: "get",
    operationId: "getSpotifyRecentlyPlayed",
    path: "/recently-played",
    responses: {
      200: {
        content: {
          "application/json": { schema: recentlyPlayedResponseSchema },
        },
        description: "Recently played tracks",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Spotify request failed or returned an invalid response",
      },
    },
    summary: "Get recently played tracks",
    tags: ["Spotify"],
  }),
  async (c) => {
    try {
      const response = await getSpotifyRecentlyPlayed();

      return c.json(response, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description: "Get the current Spotify track and playback progress.",
    method: "get",
    operationId: "getSpotifyCurrentPlaying",
    path: "/current-playing",
    responses: {
      200: {
        content: {
          "application/json": { schema: spotifyCurrentPlayingSchema },
        },
        description: "Current Spotify track",
      },
      204: { description: "No current Spotify track is available" },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Spotify request failed or returned an invalid response",
      },
    },
    summary: "Get the current Spotify track",
    tags: ["Spotify"],
  }),
  async (c) => {
    try {
      const track = await getCurrentPlayingTrack();
      if (!track) {
        return c.body(null, 204);
      }

      return c.json(track, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }

      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

export const spotifyModule = app;

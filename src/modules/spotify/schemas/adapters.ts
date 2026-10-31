import type { SpotifyCurrentPlaying as SpotifyCurrentPlayingRouteResponse } from "../route/types";
import type { SpotifyCurrentPlaying, SpotifyRecentlyPlayed } from "./types";

export function adaptRecentlyPlayedTrackResponseToSpotifyTrackingInfo(
  model: SpotifyRecentlyPlayed
) {
  const { items } = model;

  return items.map(({ track }) => {
    const { album, name, artists } = track;
    const { images } = album;
    const [image] = images;

    return {
      artists,
      image,
      name,
    };
  });
}

export function adaptCurrentPlayingReponseToSpotifyCurrentPlayingTrackInfo(
  model: SpotifyCurrentPlaying
): SpotifyCurrentPlayingRouteResponse {
  const { item, is_playing, progress_ms, timestamp } = model;
  const { album, name, artists } = item;
  const { images } = album;
  const [image] = images;

  return {
    artists: artists.map((artist) => artist.name),
    href: item.external_urls.spotify,
    image,
    isPlaying: is_playing,
    name,
    progressMs: progress_ms,
    timestamp,
  };
}

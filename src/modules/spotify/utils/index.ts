import { ServiceRequestError } from "@/shared/errors";

export async function parseSpotifyJson(response: Response) {
  if (!response.ok) {
    throw new ServiceRequestError(
      "Spotify",
      new Error(`Upstream returned HTTP ${response.status}`)
    );
  }

  return await response.json().catch((error: unknown) => {
    throw new ServiceRequestError("Spotify", error);
  });
}

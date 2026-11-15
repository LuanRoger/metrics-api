import { ServiceRequestError } from "@/shared/errors";

export async function parseRetroachievementsJson(response: Response) {
  if (!response.ok) {
    throw new ServiceRequestError(
      "RetroAchievements",
      new Error(`Upstream returned HTTP ${response.status}`)
    );
  }

  return await response.json().catch((error: unknown) => {
    throw new ServiceRequestError("RetroAchievements", error);
  });
}

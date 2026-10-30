import { ServiceRequestError } from "@/shared/errors";

export async function parseWakatimeJson(response: Response) {
  if (!response.ok) {
    throw new ServiceRequestError(
      "Wakatime",
      new Error(`Upstream returned HTTP ${response.status}`)
    );
  }

  return await response.json().catch((error: unknown) => {
    throw new ServiceRequestError("Wakatime", error);
  });
}

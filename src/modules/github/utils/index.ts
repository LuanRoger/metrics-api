import { ServiceRequestError } from "@/shared/errors";

export async function parseGitHubJson(response: Response) {
  if (!response.ok) {
    throw new ServiceRequestError(
      "GitHub",
      new Error(`Upstream returned HTTP ${response.status}`)
    );
  }

  return await response.json().catch((error: unknown) => {
    throw new ServiceRequestError("GitHub", error);
  });
}

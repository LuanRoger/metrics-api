import {
  getCacheKey,
  parseCacheEntry,
  stringifyCacheEntry,
} from "@/services/kv";
import type { SpotifyTokenResponse } from "../schemas/types";

export async function getRefreshToken(
  kv: KVNamespace,
  requestNewToken: () => Promise<SpotifyTokenResponse>
) {
  const cacheTokenKey = getCacheKey("SPOTIFY", "REFRESH_TOKEN");
  const cachedToken = await kv.get(cacheTokenKey);

  let token: SpotifyTokenResponse;
  if (cachedToken) {
    token = parseCacheEntry<SpotifyTokenResponse>(cachedToken);
  } else {
    token = await requestNewToken();

    const { expires_in: expirationTtl } = token;
    await kv.put(cacheTokenKey, stringifyCacheEntry(token), {
      expirationTtl,
    });
  }

  return token;
}

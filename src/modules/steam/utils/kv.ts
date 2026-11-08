import {
  getCacheKey,
  parseCacheEntry,
  stringifyCacheEntry,
} from "@/services/kv";
import { STEAM_GAME_SCHEMA_CACHE_TTL } from "../constants";
import type { SteamGameSchemaResponse } from "../schemas/types";

export async function getSteamGameSchema(
  kv: KVNamespace,
  appId: number,
  requestNewResponse: () => Promise<SteamGameSchemaResponse>
) {
  const cacheTokenKey = getCacheKey(
    "STEAM",
    "STEAM_GAME_SCHEMA",
    appId.toString(10)
  );
  const cachedToken = await kv.get(cacheTokenKey);

  let token: SteamGameSchemaResponse;
  if (cachedToken) {
    token = parseCacheEntry<SteamGameSchemaResponse>(cachedToken);
  } else {
    token = await requestNewResponse();

    await kv.put(cacheTokenKey, stringifyCacheEntry(token), {
      expirationTtl: STEAM_GAME_SCHEMA_CACHE_TTL,
    });
  }

  return token;
}

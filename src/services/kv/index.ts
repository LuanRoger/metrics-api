import { ParseError } from "@/shared/errors";
import {
  CACHE_KEY_PREFIX,
  type CacheDomain,
  type CacheEntryName,
} from "./constants";

export function getCacheKey(domain: CacheDomain, name: CacheEntryName): string {
  return `${CACHE_KEY_PREFIX}:${domain}:${name}`;
}

export function parseCacheEntry<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new ParseError("asdasd", { cause: error });
  }
}

export function stringifyCacheEntry<T>(data: T): string {
  return JSON.stringify(data);
}

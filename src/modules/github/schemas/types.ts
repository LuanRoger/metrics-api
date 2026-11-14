import type { z } from "@hono/zod-openapi";
import type {
  githubProfileResponseSchema,
  githubProfileRouteResponseSchema,
  githubReposResponseSchema,
  githubReposRouteResponseSchema,
  githubSearchResponseSchema,
  githubSearchRouteResponseSchema,
} from "./index";

export type GitHubProfileApiResponse = z.infer<
  typeof githubProfileResponseSchema
>;
export type GitHubProfileResponse = z.infer<
  typeof githubProfileRouteResponseSchema
>;
export type GitHubReposApiResponse = z.infer<typeof githubReposResponseSchema>;
export type GitHubReposResponse = z.infer<
  typeof githubReposRouteResponseSchema
>;
export type GitHubSearchApiResponse = z.infer<
  typeof githubSearchResponseSchema
>;
export type GitHubSearchResponse = z.infer<
  typeof githubSearchRouteResponseSchema
>;

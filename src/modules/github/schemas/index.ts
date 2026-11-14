import { z } from "@hono/zod-openapi";

export const githubProfileResponseSchema = z
  .object({
    avatar_url: z.string(),
    created_at: z.string(),
    followers: z.number(),
    html_url: z.string(),
    id: z.number(),
    login: z.string(),
    name: z.string(),
    public_gists: z.number(),
    public_repos: z.number(),
  })
  .openapi("GitHubProfileApiResponse");

export const githubProfileSchema = z
  .object({
    avatarUrl: z.string(),
    createdAt: z.string(),
    followers: z.number(),
    htmlUrl: z.string(),
    id: z.number(),
    login: z.string(),
    name: z.string(),
    publicGists: z.number(),
    publicRepos: z.number(),
  })
  .openapi("GitHubProfile");

export const githubProfileRouteResponseSchema = githubProfileSchema.openapi(
  "GitHubProfileResponse"
);

const githubRepoApiSchema = z.object({
  archived: z.boolean(),
  created_at: z.string(),
  default_branch: z.string(),
  description: z.string().nullable(),
  fork: z.boolean(),
  forks_count: z.number(),
  full_name: z.string(),
  homepage: z.string().nullable(),
  html_url: z.string(),
  id: z.number(),
  language: z.string().nullable(),
  name: z.string(),
  open_issues_count: z.number(),
  private: z.boolean(),
  pushed_at: z.string().nullable(),
  stargazers_count: z.number(),
  topics: z.array(z.string()),
  updated_at: z.string(),
  watchers_count: z.number(),
});

export const githubReposResponseSchema = z
  .array(githubRepoApiSchema)
  .openapi("GitHubReposApiResponse");

export const githubRepoSchema = z
  .object({
    archived: z.boolean(),
    createdAt: z.string(),
    defaultBranch: z.string(),
    description: z.string().nullable(),
    fork: z.boolean(),
    forksCount: z.number(),
    fullName: z.string(),
    homepage: z.string().nullable(),
    htmlUrl: z.string(),
    id: z.number(),
    language: z.string().nullable(),
    name: z.string(),
    openIssuesCount: z.number(),
    private: z.boolean(),
    pushedAt: z.string().nullable(),
    stargazersCount: z.number(),
    topics: z.array(z.string()),
    updatedAt: z.string(),
    watchersCount: z.number(),
  })
  .openapi("GitHubRepo");

export const githubReposRouteResponseSchema = z
  .array(githubRepoSchema)
  .openapi("GitHubReposResponse");

const githubSearchUserApiSchema = z.object({
  avatar_url: z.string(),
  html_url: z.string(),
  id: z.number(),
  login: z.string(),
});

const githubSearchIssueApiSchema = z.object({
  body: z.string().nullable().optional(),
  closed_at: z.string().nullable(),
  comments: z.number(),
  created_at: z.string(),
  html_url: z.string(),
  id: z.number(),
  locked: z.boolean(),
  number: z.number(),
  repository_url: z.string(),
  score: z.number(),
  state: z.string(),
  state_reason: z.string().nullable().optional(),
  title: z.string(),
  updated_at: z.string(),
  user: githubSearchUserApiSchema.nullable(),
});

export const githubSearchResponseSchema = z
  .object({
    incomplete_results: z.boolean(),
    items: z.array(githubSearchIssueApiSchema),
    total_count: z.number(),
  })
  .openapi("GitHubSearchApiResponse");

const githubSearchUserSchema = z.object({
  avatarUrl: z.string(),
  htmlUrl: z.string(),
  id: z.number(),
  login: z.string(),
});

export const githubSearchIssueSchema = z
  .object({
    body: z.string().nullable().optional(),
    closedAt: z.string().nullable(),
    comments: z.number(),
    createdAt: z.string(),
    htmlUrl: z.string(),
    id: z.number(),
    locked: z.boolean(),
    number: z.number(),
    repositoryUrl: z.string(),
    score: z.number(),
    state: z.string(),
    stateReason: z.string().nullable().optional(),
    title: z.string(),
    updatedAt: z.string(),
    user: githubSearchUserSchema.nullable(),
  })
  .openapi("GitHubSearchIssue");

export const githubSearchRouteResponseSchema = z
  .object({
    incompleteResults: z.boolean(),
    items: z.array(githubSearchIssueSchema),
    totalCount: z.number(),
  })
  .openapi("GitHubSearchResponse");

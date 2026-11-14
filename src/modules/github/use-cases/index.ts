import { ENV } from "varlock/env";
import { UnexpectedServiceResponseParseError } from "@/shared/errors";
import { GITHUB_USER_AGENT } from "../constants";
import {
  githubProfileResponseSchema,
  githubReposResponseSchema,
  githubSearchResponseSchema,
} from "../schemas";
import {
  adaptGitHubProfileResponse,
  adaptGitHubReposResponse,
  adaptGitHubSearchResponse,
} from "../schemas/adapters";
import { parseGitHubJson } from "../utils";

export async function getGitHubProfile() {
  const { GITHUB_METRIC_PAT: githubPat, GITHUB_API_URL: apiUrl } = ENV;

  const response = await fetch(`${apiUrl}/user`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubPat}`,
      "User-Agent": GITHUB_USER_AGENT,
    },
  });

  const parsedResponse = await parseGitHubJson(response);
  const { success, data, error } =
    await githubProfileResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("GitHub", error);
  }

  return adaptGitHubProfileResponse(data);
}

export async function getGitHubRepos() {
  const { GITHUB_METRIC_PAT: githubPat, GITHUB_API_URL: apiUrl } = ENV;

  const response = await fetch(
    `${apiUrl}/user/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubPat}`,
        "User-Agent": GITHUB_USER_AGENT,
      },
    }
  );
  const parsedResponse = await parseGitHubJson(response);
  const { success, data, error } =
    await githubReposResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("GitHub", error);
  }

  return adaptGitHubReposResponse(data);
}

async function searchGitHubIssues(query: string) {
  const {
    GITHUB_METRIC_PAT: githubPat,
    GITHUB_API_URL: apiUrl,
    GITHUB_USERNAME: githubUsername,
  } = ENV;
  const searchParams = new URLSearchParams({
    per_page: "100",
    q: `${query} author:${githubUsername}`,
  });

  const response = await fetch(`${apiUrl}/search/issues?${searchParams}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubPat}`,
      "User-Agent": GITHUB_USER_AGENT,
    },
  });
  const parsedResponse = await parseGitHubJson(response);
  const { success, data, error } =
    await githubSearchResponseSchema.safeParseAsync(parsedResponse);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("GitHub", error);
  }

  return adaptGitHubSearchResponse(data);
}

export async function getOpenIssues() {
  return await searchGitHubIssues("is:issue is:open");
}

export async function getDraftIssues() {
  return await searchGitHubIssues("is:draft");
}

export async function getCloseIssues() {
  return await searchGitHubIssues("is:issue is:closed");
}

export async function getOpenPullRequests() {
  return await searchGitHubIssues("is:pr is:open");
}

export async function getMergedPullRequests() {
  return await searchGitHubIssues("is:pr is:merged");
}

export async function getDraftPullRequests() {
  return await searchGitHubIssues("is:pr is:draft");
}

export async function getClosedPullRequests() {
  return await searchGitHubIssues("is:pr is:closed");
}

import type {
  GitHubProfileApiResponse,
  GitHubProfileResponse,
  GitHubReposApiResponse,
  GitHubReposResponse,
  GitHubSearchApiResponse,
  GitHubSearchResponse,
} from "./types";

export function adaptGitHubProfileResponse(
  response: GitHubProfileApiResponse
): GitHubProfileResponse {
  return {
    avatarUrl: response.avatar_url,
    createdAt: response.created_at,
    followers: response.followers,
    htmlUrl: response.html_url,
    id: response.id,
    login: response.login,
    name: response.name,
    publicGists: response.public_gists,
    publicRepos: response.public_repos,
  };
}

export function adaptGitHubReposResponse(
  response: GitHubReposApiResponse
): GitHubReposResponse {
  return response.map((repo) => ({
    archived: repo.archived,
    createdAt: repo.created_at,
    defaultBranch: repo.default_branch,
    description: repo.description,
    fork: repo.fork,
    forksCount: repo.forks_count,
    fullName: repo.full_name,
    homepage: repo.homepage,
    htmlUrl: repo.html_url,
    id: repo.id,
    language: repo.language,
    name: repo.name,
    openIssuesCount: repo.open_issues_count,
    private: repo.private,
    pushedAt: repo.pushed_at,
    stargazersCount: repo.stargazers_count,
    topics: repo.topics,
    updatedAt: repo.updated_at,
    watchersCount: repo.watchers_count,
  }));
}

export function adaptGitHubSearchResponse(
  response: GitHubSearchApiResponse
): GitHubSearchResponse {
  return {
    incompleteResults: response.incomplete_results,
    items: response.items.map((issue) => ({
      body: issue.body,
      closedAt: issue.closed_at,
      comments: issue.comments,
      createdAt: issue.created_at,
      htmlUrl: issue.html_url,
      id: issue.id,
      locked: issue.locked,
      number: issue.number,
      repositoryUrl: issue.repository_url,
      score: issue.score,
      state: issue.state,
      stateReason: issue.state_reason,
      title: issue.title,
      updatedAt: issue.updated_at,
      user: issue.user && {
        avatarUrl: issue.user.avatar_url,
        htmlUrl: issue.user.html_url,
        id: issue.user.id,
        login: issue.user.login,
      },
    })),
    totalCount: response.total_count,
  };
}

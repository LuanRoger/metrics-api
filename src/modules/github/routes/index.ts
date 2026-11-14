import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  formatServiceError,
  formatValidationIssues,
} from "@/shared/errors/utils";
import { responseErrorSchema } from "@/shared/schemas";
import {
  githubProfileRouteResponseSchema,
  githubReposRouteResponseSchema,
  githubSearchRouteResponseSchema,
} from "../schemas";
import {
  getClosedPullRequests,
  getCloseIssues,
  getDraftPullRequests,
  getGitHubProfile,
  getGitHubRepos,
  getMergedPullRequests,
  getOpenIssues,
  getOpenPullRequests,
} from "../use-cases";
import { issueQuerySchema, pullRequestQuerySchema } from "./schemas";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: "INVALID_REQUEST",
            details: formatValidationIssues(result.error),
            message: "The request is invalid.",
          },
        },
        400
      );
    }
  },
});

app.openapi(
  createRoute({
    method: "get",
    operationId: "getGitHubProfile",
    path: "/profile",
    responses: {
      200: {
        content: {
          "application/json": { schema: githubProfileRouteResponseSchema },
        },
        description: "Authenticated GitHub profile",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "GitHub request failed or returned an invalid response",
      },
    },
    summary: "Get GitHub profile",
    tags: ["GitHub"],
  }),
  async (c) => {
    try {
      return c.json(await getGitHubProfile(), 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description:
      "Returns up to 100 repositories accessible to the authenticated user, ordered by update time.",
    method: "get",
    operationId: "getGitHubRepos",
    path: "/repositories",
    responses: {
      200: {
        content: {
          "application/json": { schema: githubReposRouteResponseSchema },
        },
        description: "GitHub repositories",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "GitHub request failed or returned an invalid response",
      },
    },
    summary: "Get GitHub repositories",
    tags: ["GitHub"],
  }),
  async (c) => {
    try {
      return c.json(await getGitHubRepos(), 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description:
      "Search issues authored by the configured GitHub user. Draft issues are not supported by GitHub search.",
    method: "get",
    operationId: "getGitHubIssues",
    path: "/issues",
    request: { query: issueQuerySchema },
    responses: {
      200: {
        content: {
          "application/json": { schema: githubSearchRouteResponseSchema },
        },
        description: "Matching GitHub issues",
      },
      400: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Invalid or unsupported query parameters",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "GitHub request failed or returned an invalid response",
      },
    },
    summary: "Get GitHub issues",
    tags: ["GitHub"],
  }),
  async (c) => {
    const { status } = c.req.valid("query");
    try {
      const issues = await (status === "closed"
        ? getCloseIssues()
        : getOpenIssues());
      return c.json(issues, 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

app.openapi(
  createRoute({
    description: "Search pull requests authored by the configured GitHub user.",
    method: "get",
    operationId: "getGitHubPullRequests",
    path: "/pull-requests",
    request: { query: pullRequestQuerySchema },
    responses: {
      200: {
        content: {
          "application/json": { schema: githubSearchRouteResponseSchema },
        },
        description: "Matching GitHub pull requests",
      },
      400: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Invalid or unsupported query parameters",
      },
      500: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "Unexpected internal error",
      },
      502: {
        content: { "application/json": { schema: responseErrorSchema } },
        description: "GitHub request failed or returned an invalid response",
      },
    },
    summary: "Get GitHub pull requests",
    tags: ["GitHub"],
  }),
  async (c) => {
    const { status } = c.req.valid("query");
    const useCases = {
      closed: getClosedPullRequests,
      draft: getDraftPullRequests,
      merged: getMergedPullRequests,
      open: getOpenPullRequests,
    };
    try {
      return c.json(await useCases[status](), 200);
    } catch (error) {
      const serviceError = formatServiceError(error);
      if (serviceError) {
        return c.json({ error: serviceError }, 502);
      }
      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred.",
          },
        },
        500
      );
    }
  }
);

export const githubModule = app;

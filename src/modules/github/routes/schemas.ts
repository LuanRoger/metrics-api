import z from "zod";

export const issueQuerySchema = z.object({
  status: z
    .enum(["open", "closed", "draft"])
    .default("open")
    .openapi({
      description:
        "Issue status; draft issues are not supported by GitHub search.",
      param: { in: "query", name: "status" },
    }),
});
export const pullRequestQuerySchema = z.object({
  status: z
    .enum(["open", "closed", "draft", "merged"])
    .default("open")
    .openapi({
      description: "Pull request status.",
      param: { in: "query", name: "status" },
    }),
});

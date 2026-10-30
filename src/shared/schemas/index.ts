import { z } from "@hono/zod-openapi";

const validationIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
});

export const responseErrorSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "INVALID_REQUEST" }),
      details: z.array(validationIssueSchema).optional(),
      message: z.string().openapi({ example: "The request is invalid." }),
    }),
  })
  .openapi("Error");

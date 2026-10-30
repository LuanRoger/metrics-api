import { z } from "@hono/zod-openapi";

export const responseErrorSchema = z.object({ error: z.string() });

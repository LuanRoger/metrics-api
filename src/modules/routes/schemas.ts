import { z } from "@hono/zod-openapi";

const activitySchema = z.object({
  hours: z.number(),
  minutes: z.number(),
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  totalSeconds: z.number(),
});

const languageMetadataSchema = z.object({
  aliases: z.array(z.string()),
  color: z.string().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  extensions: z.array(z.string()),
  id: z.uuid(),
  isVerified: z.boolean(),
  modifiedAt: z.iso.datetime({ offset: true }).nullable(),
  name: z.string(),
});

export const wakatimeStatsSchema = z
  .object({
    averageText: z.string(),
    categories: z.array(activitySchema),
    editors: z.array(activitySchema),
    languages: z.array(
      activitySchema.extend({
        metadata: languageMetadataSchema.optional(),
      })
    ),
    totalInSeconds: z.number(),
    totalText: z.string(),
  })
  .openapi("WakatimeStats");

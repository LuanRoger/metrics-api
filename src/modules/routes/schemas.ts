import { z } from "@hono/zod-openapi";

const activitySchema = z.object({
  hours: z
    .number()
    .openapi({ description: "Whole hours in the duration.", example: 2 }),
  minutes: z.number().openapi({
    description: "Remaining whole minutes in the duration.",
    example: 15,
  }),
  name: z
    .string()
    .openapi({ description: "Activity name.", example: "TypeScript" }),
  percent: z.number().openapi({
    description: "Percentage of tracked activity.",
    example: 40.04,
  }),
  text: z.string().openapi({
    description: "Human-readable duration.",
    example: "2 hrs 15 mins",
  }),
  totalSeconds: z
    .number()
    .openapi({ description: "Duration in seconds.", example: 8100 }),
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

export const wakatimeSummaryResponseSchema = z
  .object({
    cumulativeTotal: z.object({
      decimal: z.string(),
      digital: z.string(),
      seconds: z.number(),
      text: z.string(),
    }),
    dailyAverage: z.object({
      daysIncludingHolidays: z.number(),
      daysMinusHolidays: z.number(),
      holidays: z.number(),
      seconds: z.number(),
      secondsIncludingOtherLanguage: z.number(),
      text: z.string(),
      textIncludingOtherLanguage: z.string(),
    }),
    data: z.array(
      z.object({
        categories: z.array(activitySchema),
        grandTotal: z.object({
          aiAdditions: z.number(),
          aiCachedInputTokens: z.number(),
          aiDeletions: z.number(),
          aiInputTokens: z.number(),
          aiModelBreakdown: z.array(z.unknown()),
          aiModelCosts: z.record(z.string(), z.unknown()),
          aiModelLineChanges: z.record(z.string(), z.unknown()),
          aiModelTotalCost: z.number(),
          aiOutputTokens: z.number(),
          aiPromptEventsAvgPerSession: z.number(),
          aiPromptEventsMedianPerSession: z.number(),
          aiPromptEventsTotal: z.number(),
          aiPromptLengthAvg: z.number(),
          aiPromptLengthAvgPerSession: z.number(),
          aiPromptLengthMedianPerSession: z.number(),
          aiPromptLengthSum: z.number(),
          aiSessions: z.number(),
          decimal: z.string(),
          digital: z.string(),
          hours: z.number(),
          humanAdditions: z.number(),
          humanDeletions: z.number(),
          minutes: z.number(),
          text: z.string(),
          totalSeconds: z.number(),
        }),
        languages: z.array(activitySchema),
        operatingSystems: z.array(activitySchema),
      })
    ),
    end: z.iso.datetime({ offset: true }),
    start: z.iso.datetime({ offset: true }),
  })
  .openapi("WakatimeSummary");

export const summaryTimeRange = z.enum([
  "today",
  "yesterday",
  "last_7_days",
  "last_7_days_from_yesterday",
]);

export const wakatimeGetSummaryQuerySchema = z.object({
  range: summaryTimeRange.default("today").openapi({
    description: "Time range to summarize; defaults to today.",
    example: "last_7_days",
    param: { in: "query", name: "range" },
  }),
});

export const wakatimeStatsResponseSchema = z
  .object({
    averageText: z.string(),
    categories: z.array(activitySchema),
    editors: z.array(activitySchema),
    languages: z.array(
      activitySchema.extend({
        metadata: languageMetadataSchema.optional(),
      })
    ),
    totalInSeconds: z.number().openapi({
      description: "Total tracked seconds excluding other languages.",
      example: 98_413,
    }),
    totalText: z.string().openapi({
      description: "Human-readable total including other languages.",
      example: "28 hrs 32 mins",
    }),
  })
  .openapi("WakatimeStats");

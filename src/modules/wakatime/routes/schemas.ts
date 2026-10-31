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

const aggregatedActivitySchema = z.object({
  name: z.string(),
  percent: z
    .number()
    .openapi({ description: "Percentage of the cumulative tracked time." }),
  totalSeconds: z
    .number()
    .openapi({ description: "Total seconds across the selected range." }),
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
    categories: z.array(aggregatedActivitySchema),
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
    end: z.iso.datetime({ offset: true }),
    languages: z.array(aggregatedActivitySchema),
    operatingSystems: z.array(aggregatedActivitySchema),
    start: z.iso.datetime({ offset: true }),
  })
  .openapi("WakatimeSummary");

export const wakatimeOverviewResponseSchema = z
  .object({
    dailyAverage: z.number().openapi({
      description:
        "Average tracked seconds per day since the account start date.",
      example: 11_854,
    }),
    decimal: z.string().openapi({ example: "4461.63" }),
    digital: z.string().openapi({ example: "4461:38" }),
    isUpToDate: z.boolean().openapi({ example: true }),
    percentCalculated: z.number().openapi({ example: 100 }),
    range: z.object({
      end: z.iso.datetime({ offset: true }),
      endDate: z.iso.date(),
      endText: z.string(),
      start: z.iso.datetime({ offset: true }),
      startDate: z.iso.date(),
      startText: z.string(),
      timezone: z.string(),
    }),
    text: z.string().openapi({ example: "4,465 hrs 58 mins" }),
    timeout: z.number().openapi({ example: 15 }),
    totalSeconds: z.number().openapi({ example: 16_077_513.444_513 }),
  })
  .openapi("WakatimeOverview");

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

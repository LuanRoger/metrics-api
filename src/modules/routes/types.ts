import type z from "zod";
import type { summaryTimeRange, wakatimeStatsResponseSchema } from "./schemas";

export type WakatimeStats = z.infer<typeof wakatimeStatsResponseSchema>;
export type SummaryTimeRange = z.infer<typeof summaryTimeRange>;

import type { z } from "zod";
import type {
  wakatimeLanguageMetadataSchema,
  wakatimeStatsResponseSchema,
  wakatimeSummaryResponseSchema,
} from "./index";

export type WakatimeSummaryResponse = z.infer<
  typeof wakatimeSummaryResponseSchema
>;
export type WakatimeStatsResponse = z.infer<typeof wakatimeStatsResponseSchema>;
export type WakatimeLanguageMetadata = z.infer<
  typeof wakatimeLanguageMetadataSchema
>;

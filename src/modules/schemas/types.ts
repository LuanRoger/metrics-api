import type { z } from "zod";
import type { wakatimeStatsSchema } from "../routes/schemas";
import type {
  wakatimeLanguageMetadataSchema,
  wakatimeStatsResponseSchema,
} from "./index";

export type WakatimeStats = z.infer<typeof wakatimeStatsSchema>;
export type WakatimeStatsResponse = z.infer<typeof wakatimeStatsResponseSchema>;
export type WakatimeLanguageMetadata = z.infer<
  typeof wakatimeLanguageMetadataSchema
>;

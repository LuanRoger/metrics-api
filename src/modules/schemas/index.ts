import { z } from "zod";

export const wakatimeLanguageMetadataSchema = z.object({
  aliases: z.array(z.string()),
  color: z.string().nullable(),
  created_at: z.iso.datetime({ offset: true }),
  extensions: z.array(z.string()),
  id: z.uuid(),
  is_verified: z.boolean(),
  modified_at: z.iso.datetime({ offset: true }).nullable(),
  name: z.string(),
});

export const wakatimeEditorSchema = z.object({
  ai_coding_seconds: z.union([z.number(), z.string()]),
  decimal: z.string(),
  digital: z.string(),
  hours: z.number(),
  manual_coding_seconds: z.union([z.number(), z.string()]),
  minutes: z.number(),
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  total_seconds: z.number(),
});

export const wakatimeOperationSystemSchema = z.object({
  ai_coding_seconds: z.union([z.number(), z.string()]),
  decimal: z.string(),
  digital: z.string(),
  hours: z.number(),
  manual_coding_seconds: z.union([z.number(), z.string()]),
  minutes: z.number(),
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  total_seconds: z.number(),
});

export const wakatimeCategorySchema = z.object({
  decimal: z.string(),
  digital: z.string(),
  hours: z.number(),
  minutes: z.number(),
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  total_seconds: z.number(),
});

export const wakatimeLanguageSchema = z.object({
  ai_coding_seconds: z.string(),
  decimal: z.string(),
  digital: z.string(),
  hours: z.number(),
  manual_coding_seconds: z.string(),
  minutes: z.number(),
  name: z.string(),
  percent: z.number(),
  text: z.string(),
  total_seconds: z.number(),
});

export const wakatimeStatsResponseSchema = z.object({
  data: z.object({
    ai_models: z.array(z.unknown()),
    categories: z.array(wakatimeCategorySchema),
    daily_average: z.number(),
    daily_average_including_other_language: z.number(),
    days_including_holidays: z.number(),
    days_minus_holidays: z.number(),
    editors: z.array(wakatimeEditorSchema),
    holidays: z.number(),
    human_readable_daily_average: z.string(),
    human_readable_daily_average_including_other_language: z.string(),
    human_readable_range: z.string(),
    human_readable_total: z.string(),
    human_readable_total_including_other_language: z.string(),
    id: z.uuid(),
    is_ai_model_usage_visible: z.boolean(),
    is_already_updating: z.boolean(),
    is_cached: z.boolean(),
    is_category_usage_visible: z.boolean(),
    is_coding_activity_visible: z.boolean(),
    is_editor_usage_visible: z.boolean(),
    is_including_today: z.boolean(),
    is_language_usage_visible: z.boolean(),
    is_os_usage_visible: z.boolean(),
    is_stuck: z.boolean(),
    is_up_to_date: z.boolean(),
    is_up_to_date_pending_future: z.boolean(),
    languages: z.array(wakatimeLanguageSchema),
    operating_systems: z.array(wakatimeOperationSystemSchema),
    percent_calculated: z.number(),
    range: z.string(),
    status: z.string(),
    timeout: z.number(),
    total_seconds: z.number(),
    total_seconds_including_other_language: z.number(),
    user_id: z.uuid(),
    username: z.string(),
    writes_only: z.boolean(),
  }),
});

export const wakatimeProgramLanguagesResponseSchema = z.object({
  data: z.array(wakatimeLanguageMetadataSchema),
  total: z.number(),
});

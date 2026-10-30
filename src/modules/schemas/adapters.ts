import type { WakatimeStats } from "../routes/types";
import type {
  WakatimeLanguageMetadata,
  WakatimeStatsResponse,
  WakatimeSummaryResponse,
} from "./types";

type Activity = WakatimeStatsResponse["data"]["categories"][number];

function adaptActivity(activity: Activity) {
  return {
    hours: activity.hours,
    minutes: activity.minutes,
    name: activity.name,
    percent: activity.percent,
    text: activity.text,
    totalSeconds: activity.total_seconds,
  };
}

export function adaptWakatimeResponseToWakatimeSummary(
  model: WakatimeSummaryResponse
) {
  const { cumulative_total: cumulative, daily_average: average } = model;

  return {
    cumulativeTotal: {
      decimal: cumulative.decimal,
      digital: cumulative.digital,
      seconds: cumulative.seconds,
      text: cumulative.text,
    },
    dailyAverage: {
      daysIncludingHolidays: average.days_including_holidays,
      daysMinusHolidays: average.days_minus_holidays,
      holidays: average.holidays,
      seconds: average.seconds,
      secondsIncludingOtherLanguage: average.seconds_including_other_language,
      text: average.text,
      textIncludingOtherLanguage: average.text_including_other_language,
    },
    data: model.data.map((day) => {
      const total = day.grand_total;
      return {
        categories: day.categories.map(adaptActivity),
        grandTotal: {
          aiAdditions: total.ai_additions,
          aiCachedInputTokens: total.ai_cached_input_tokens,
          aiDeletions: total.ai_deletions,
          aiInputTokens: total.ai_input_tokens,
          aiModelBreakdown: total.ai_model_breakdown,
          aiModelCosts: total.ai_model_costs,
          aiModelLineChanges: total.ai_model_line_changes,
          aiModelTotalCost: total.ai_model_total_cost,
          aiOutputTokens: total.ai_output_tokens,
          aiPromptEventsAvgPerSession: total.ai_prompt_events_avg_per_session,
          aiPromptEventsMedianPerSession:
            total.ai_prompt_events_median_per_session,
          aiPromptEventsTotal: total.ai_prompt_events_total,
          aiPromptLengthAvg: total.ai_prompt_length_avg,
          aiPromptLengthAvgPerSession: total.ai_prompt_length_avg_per_session,
          aiPromptLengthMedianPerSession:
            total.ai_prompt_length_median_per_session,
          aiPromptLengthSum: total.ai_prompt_length_sum,
          aiSessions: total.ai_sessions,
          decimal: total.decimal,
          digital: total.digital,
          hours: total.hours,
          humanAdditions: total.human_additions,
          humanDeletions: total.human_deletions,
          minutes: total.minutes,
          text: total.text,
          totalSeconds: total.total_seconds,
        },
        languages: day.languages.map(adaptActivity),
        operatingSystems: day.operating_systems.map(adaptActivity),
      };
    }),
    end: model.end,
    start: model.start,
  };
}

export function adaptWakatimeResponseToWakatimeStats(
  model: WakatimeStatsResponse,
  languageMetadata: WakatimeLanguageMetadata[] = []
): WakatimeStats {
  const { data } = model;
  const metadataByName = new Map(
    languageMetadata.map((metadata) => [metadata.name, metadata])
  );

  return {
    averageText: data.human_readable_daily_average_including_other_language,
    categories: data.categories.map(adaptActivity),
    editors: data.editors.map(adaptActivity),
    languages: data.languages.map((language) => {
      const metadata = metadataByName.get(language.name);
      return {
        ...adaptActivity(language),
        metadata: metadata && {
          aliases: metadata.aliases,
          color: metadata.color,
          createdAt: metadata.created_at,
          extensions: metadata.extensions,
          id: metadata.id,
          isVerified: metadata.is_verified,
          modifiedAt: metadata.modified_at,
          name: metadata.name,
        },
      };
    }),
    totalInSeconds: data.total_seconds,
    totalText: data.human_readable_total_including_other_language,
  };
}

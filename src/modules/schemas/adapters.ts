import type { WakatimeStats } from "../routes/types";
import type {
  WakatimeAllTimeResponse,
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

function aggregateSummaryActivities(
  days: WakatimeSummaryResponse["data"],
  key: "categories" | "languages" | "operating_systems",
  totalSeconds: number
) {
  const totals = new Map<string, number>();
  for (const day of days) {
    for (const activity of day[key]) {
      totals.set(
        activity.name,
        (totals.get(activity.name) ?? 0) + activity.total_seconds
      );
    }
  }

  return Array.from(totals, ([name, seconds]) => ({
    name,
    percent:
      totalSeconds > 0
        ? Math.round((seconds / totalSeconds) * 10_000) / 100
        : 0,
    totalSeconds: seconds,
  })).sort((a, b) => b.totalSeconds - a.totalSeconds);
}

export function adaptWakatimeAllTimeResponseToStats(
  model: WakatimeAllTimeResponse
) {
  const { data } = model;
  const { range } = data;

  return {
    dailyAverage: data.daily_average,
    decimal: data.decimal,
    digital: data.digital,
    isUpToDate: data.is_up_to_date,
    percentCalculated: data.percent_calculated,
    range: {
      end: range.end,
      endDate: range.end_date,
      endText: range.end_text,
      start: range.start,
      startDate: range.start_date,
      startText: range.start_text,
      timezone: range.timezone,
    },
    text: data.text,
    timeout: data.timeout,
    totalSeconds: data.total_seconds,
  };
}

export function adaptWakatimeResponseToWakatimeSummary(
  model: WakatimeSummaryResponse
) {
  const { cumulative_total: cumulative, daily_average: average } = model;

  return {
    categories: aggregateSummaryActivities(
      model.data,
      "categories",
      cumulative.seconds
    ),
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
    end: model.end,
    languages: aggregateSummaryActivities(
      model.data,
      "languages",
      cumulative.seconds
    ),
    operatingSystems: aggregateSummaryActivities(
      model.data,
      "operating_systems",
      cumulative.seconds
    ),
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

import type {
  WakatimeLanguageMetadata,
  WakatimeStats,
  WakatimeStatsResponse,
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

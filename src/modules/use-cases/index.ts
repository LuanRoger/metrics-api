import {
  ServiceRequestError,
  UnexpectedServiceResponseParseError,
} from "@shared/errors";
import { ENV } from "varlock/env";
import type { SummaryTimeRange } from "../routes/types";
import {
  wakatimeProgramLanguagesResponseSchema,
  wakatimeStatsResponseSchema,
  wakatimeSummaryResponseSchema,
} from "../schemas";
import {
  adaptWakatimeResponseToWakatimeStats,
  adaptWakatimeResponseToWakatimeSummary,
} from "../schemas/adapters";
import type { WakatimeSummaryTimeRange } from "../types";

async function parseWakatimeJson(response: Response) {
  if (!response.ok) {
    throw new ServiceRequestError(
      "Wakatime",
      new Error(`Upstream returned HTTP ${response.status}`)
    );
  }

  return await response.json().catch((error: unknown) => {
    throw new ServiceRequestError("Wakatime", error);
  });
}

export async function getWakatimeFullStats() {
  const [stats, languages] = await Promise.all([
    getWakatimeStats(),
    getWakatimeLanguages(),
  ]);

  return adaptWakatimeResponseToWakatimeStats(stats, languages.data);
}

export async function getWakatimeStats() {
  const { WAKATIME_URL: wakatimeUrl, WAKATIME_OAUTH_KEY: wakatimeKey } = ENV;

  const response = await fetch(
    `${wakatimeUrl}/users/current/stats?api_key=${wakatimeKey}`
  ).catch((requestError) => {
    throw new ServiceRequestError("Wakatime", requestError);
  });

  const json = await parseWakatimeJson(response);

  const { success, error, data } =
    await wakatimeStatsResponseSchema.safeParseAsync(json);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Wakatime", error);
  }

  return data;
}

export async function getWakatimeLanguages() {
  const { WAKATIME_URL: wakatimeUrl, WAKATIME_OAUTH_KEY: wakatimeKey } = ENV;

  const response = await fetch(
    `${wakatimeUrl}/program_languages?api_key=${wakatimeKey}`
  ).catch((requestError) => {
    throw new ServiceRequestError("Wakatime", requestError);
  });

  const json = await parseWakatimeJson(response);
  const { success, error, data } =
    await wakatimeProgramLanguagesResponseSchema.safeParseAsync(json);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Wakatime", error);
  }

  return data;
}

export async function getWakatimeSummary(range: SummaryTimeRange) {
  const { WAKATIME_URL: wakatimeUrl, WAKATIME_OAUTH_KEY: wakatimeKey } = ENV;

  let wakatimeRange: WakatimeSummaryTimeRange;
  // biome-ignore lint/style/useDefaultSwitchClause: This switch statement is used to map the range to the correct Wakatime range string.
  switch (range) {
    case "today":
      wakatimeRange = "Today";
      break;
    case "yesterday":
      wakatimeRange = "Yesterday";
      break;
    case "last_7_days":
      wakatimeRange = "Last 7 Days";
      break;
    case "last_7_days_from_yesterday":
      wakatimeRange = "Last 7 Days from Yesterday";
      break;
  }

  const response = await fetch(
    `${wakatimeUrl}/users/current/summaries?range=${wakatimeRange}&api_key=${wakatimeKey}`
  ).catch((requestError) => {
    throw new ServiceRequestError("Wakatime", requestError);
  });

  const json = await parseWakatimeJson(response);
  const { success, error, data } =
    await wakatimeSummaryResponseSchema.safeParseAsync(json);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Wakatime", error);
  }

  return adaptWakatimeResponseToWakatimeSummary(data);
}

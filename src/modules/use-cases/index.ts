import {
  ServiceRequestError,
  UnexpectedServiceResponseParseError,
} from "@shared/errors";
import { ENV } from "varlock/env";
import {
  wakatimeProgramLanguagesResponseSchema,
  wakatimeStatsResponseSchema,
} from "../schemas";
import { adaptWakatimeResponseToWakatimeStats } from "../schemas/adapters";

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

  const json = await response.json();

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

  const json = await response.json();
  const { success, error, data } =
    await wakatimeProgramLanguagesResponseSchema.safeParseAsync(json);
  if (!success) {
    throw new UnexpectedServiceResponseParseError("Wakatime", error);
  }

  return data;
}

import { z } from "@hono/zod-openapi";
import {
  retroachievementsAchievementSchema,
  retroachievementsGameProgressSchema,
  retroachievementsLastPlayedGameSchema,
  retroachievementsUserProfileSchema,
} from "../schemas";

export const userProfileResponseSchema = retroachievementsUserProfileSchema
  .extend({ memberSince: z.iso.datetime() })
  .openapi("RetroachievementsUserProfileResponse");

export const lastPlayedGameResponseSchema =
  retroachievementsLastPlayedGameSchema
    .extend({ lastPlayed: z.iso.datetime() })
    .openapi("RetroachievementsLastPlayedGameResponse");

const achievementResponseSchema = retroachievementsAchievementSchema.extend({
  dateEarned: z.iso.datetime(),
});

export const gameProgressResponseSchema = retroachievementsGameProgressSchema
  .extend({ achievements: z.array(achievementResponseSchema) })
  .openapi("RetroachievementsGameProgressResponse");

export const gameProgressParamsSchema = z.object({
  gameId: z
    .string()
    .regex(/^[1-9]\d*$/u)
    .openapi({
      description: "RetroAchievements game ID.",
      example: "14402",
      param: { in: "path", name: "gameId" },
    }),
});

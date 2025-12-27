import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "../lib/prisma";

export const PRO_POINTS = 6;
export const FREE_POINTS = 2;
export const DURATION = 30 * 24 * 60 * 60;
export const GENRATION_COST = 1;

export const getUsageTracker = (hasProAccess: boolean) => {
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "RateLimiterFlexible",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });
  return usageTracker;
};

export const consumeCredits = async (userId: string, hasProAccess: boolean) => {
  const usageTracker = getUsageTracker(hasProAccess);
  const result = await usageTracker.consume(userId, GENRATION_COST);
  return result;
};

export const getUsageStatus = async (userId: string, hasProAccess: boolean) => {
  try {
    const usageTracker = getUsageTracker(hasProAccess);
    const result = await usageTracker.get(userId);
    if (!result) {
      return {
        consumed: 0,
        remaining: hasProAccess ? PRO_POINTS : FREE_POINTS,
        total: hasProAccess ? PRO_POINTS : FREE_POINTS,
      };
    }
    return {
      consumed: result.consumedPoints,
      remaining: result.remainingPoints,
      total: hasProAccess ? PRO_POINTS : FREE_POINTS,
    };
  } catch (error) {
    console.log("Error Getting Usage: ", error);
    return null;
  }
};

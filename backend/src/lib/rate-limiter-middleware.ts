import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { consumeCredits } from "../services/credit-service";

export async function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, has } = getAuth(req);
    const hasProAccess = has({ plan: "pro" });
    try {
      const result = await consumeCredits(userId!, hasProAccess);
      res.setHeader("X-RateLimit-Remaining", result.remainingPoints);
    } catch {
      const plan = hasProAccess ? "pro" : "free";
      return res.status(429).json({
        success: false,
        error: "Project Creation limit reached",
        message: `You've reached your ${plan} plan limit. ${
          plan === "free"
            ? "Upgrade to Pro to create more projects."
            : "Contact support for enterprise options."
        }`,
      });
    }
    next();
  } catch (error) {
    console.log("Rate Limiter Middleware Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}

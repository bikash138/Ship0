import { prisma } from "../lib/prisma";
import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
export const clerkWebhookRoute: express.Router = express.Router();

clerkWebhookRoute.post("/webhooks", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    console.log("Webhook received");
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error("Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
    }

    const evt = await verifyWebhook(req, {
      signingSecret: SIGNING_SECRET,
    });

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data as {
        id: string;
        email_addresses?: { email_address: string }[];
        first_name?: string;
        last_name?: string;
      };
      const email = email_addresses?.[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

      if (id && email) {
        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email,
            name,
          },
          update: {
            email,
            name,
          },
        });
        console.log(`User ${eventType === "user.created" ? "created" : "updated"}:`, id);
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data as { id: string };
      try {
        await prisma.user.delete({
          where: {
            clerkId: id,
          },
        });
        console.log("User deleted:", id);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
          console.log("User not found for deletion, ignoring:", id);
        } else {
          throw error;
        }
      }
    }
    console.log("Webhook received");
    return res.send("Webhook received");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
});

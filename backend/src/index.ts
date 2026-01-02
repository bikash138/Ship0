import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth } from "@clerk/express";
import { clerkWebhookRoute } from "./routes/clerk-webhook";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/functions";
import { projectRoute } from "./routes/project-routes/project";
import { messageRoute } from "./routes/message-routes/messages";
import { creditRoute } from "./routes/credits-route/credit";
import { healthRoute } from "./routes/health/health-route";
import { sandboxRoute } from "./routes/sandbox-routes/sandbox";

const app = express();
app.use("/api/v1", clerkWebhookRoute);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "https://ship0.bikashdev.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 4000;

app.get("/", async (req, res) => {
  res.send("Welcome to Ship0 server");
});
app.use("/api/v1", healthRoute);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/v1/projects", requireAuth(), projectRoute);
app.use("/api/v1/messages", requireAuth(), messageRoute);
app.use("/api/v1/sandbox", requireAuth(), sandboxRoute);
app.use("/api/v1", requireAuth(), creditRoute);

app.listen(PORT, () => {
  console.log(`Ship0 backend in up at PORT: ${PORT}`);
});

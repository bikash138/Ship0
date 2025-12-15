import express from 'express'
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import { clerkWebhookRoute } from "./routes/clerk-webhook";
import { serve } from 'inngest/express';
import { inngest, functions } from "./inngest/functions";

const app = express()
app.use(clerkMiddleware());
app.use("/api/v1", clerkWebhookRoute);
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000

app.get('/', (req,res)=>{
    res.send("Welcome to Ship0 server")
})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("api/v1/", )

app.listen(PORT, ()=>{
    console.log(`Ship0 backend in up at PORT: ${PORT}`)
})


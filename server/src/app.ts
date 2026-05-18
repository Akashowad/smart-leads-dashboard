import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { leadRouter } from "./routes/lead.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [env.CLIENT_URL, "http://localhost:5173", "http://localhost:5200"];
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (origin.endsWith(".vercel.app") && origin.includes("smart-leads-dashboard")) ||
        origin.startsWith("http://localhost:");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

app.get("/health", (_req, res) => res.json({ success: true, message: "API is healthy" }));
app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);
app.use(notFound);
app.use(errorHandler);

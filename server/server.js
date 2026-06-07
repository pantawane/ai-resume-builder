import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { generalLimiter, authLimiter, aiLimiter } from "./middleware/rateLimitMiddleware.js";

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ Request logging
app.use(morgan('dev'));

// ✅ CORS
app.use(cors());

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));

// ✅ General rate limit on all routes
app.use(generalLimiter);

// ✅ MongoDB lazy connection (Vercel-safe)
let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Routes with specific rate limits
app.get("/", (req, res) => res.json({
  message: "AI Resume Builder API is live! 🚀",
  version: "2.0.0",
  features: [
    "Resume Builder",
    "Cover Letter Generator",
    "ATS Scorer",
    "AI Template Generator",
    "Interview Prep",
    "Bullet Suggestions",
    "LinkedIn Import",
    "Job Tracker"
  ]
}));

app.use("/api/users", authLimiter, userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiLimiter, aiRouter);
app.use("/api/jobs", jobRouter);

// ✅ 404 handler
app.use(notFound);

// ✅ Global error handler (must be last!)
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
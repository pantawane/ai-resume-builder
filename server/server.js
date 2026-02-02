import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB lazy connection (Vercel-safe)
let isConnected = false;

async function connectToMongoDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Ensure DB before routes
app.use(async (req, res, next) => {
  await connectToMongoDB();
  next();
});

// Routes
app.get("/", (req, res) => res.send("Server is live..."));
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

export default app;

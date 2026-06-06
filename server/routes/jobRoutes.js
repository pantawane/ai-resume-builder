import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getAllJobs, addJob, updateJob, deleteJob } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/all", protect, getAllJobs);
jobRouter.post("/add", protect, addJob);
jobRouter.put("/update", protect, updateJob);
jobRouter.delete("/delete/:jobId", protect, deleteJob);

export default jobRouter;
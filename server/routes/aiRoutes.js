import express from "express";
import protect from "../middleware/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume, generateCoverLetter, analyzeATS, generateTemplate, generateInterviewQuestions  } from "../controllers/aiController.js";

const aiRouter = express.Router();


aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)
aiRouter.post("/cover-letter", protect, generateCoverLetter);
aiRouter.post("/analyze-ats", protect, analyzeATS);
aiRouter.post("/interview-questions", protect, generateInterviewQuestions);

export default aiRouter;
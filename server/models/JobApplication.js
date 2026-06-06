import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  salary: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected"],
    default: "applied",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: "",
  },
  jobUrl: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("JobApplication", jobApplicationSchema);
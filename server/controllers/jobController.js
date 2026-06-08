import JobApplication from "../models/JobApplication.js";

// Get all jobs for user
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new job
export const addJob = async (req, res) => {
  try {
    const { company, position, location, salary, status, notes, jobUrl } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: "Company and position are required" });
    }

    const job = await JobApplication.create({
      userId: req.userId,
      company,
      position,
      location,
      salary,
      status: status || "applied",
      notes,
      jobUrl,
    });

    res.json({ message: "Job added successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job status or details
export const updateJob = async (req, res) => {
  try {
    const { jobId, ...updateData } = req.body;

    const job = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobApplication.findOneAndDelete({
      _id: jobId,
      userId: req.userId,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
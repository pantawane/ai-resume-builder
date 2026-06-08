import { Response } from 'express';
import JobApplication from '../models/JobApplication.js';
import { AuthRequest } from '../types/index.js';

// Get all jobs
export const getAllJobs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const jobs = await JobApplication.find({ userId: req.userId })
    .sort({ createdAt: -1 });
  res.json({ jobs });
};

// Add new job
export const addJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { company, position, location, salary, status, notes, jobUrl } = req.body;

  if (!company || !position) {
    res.status(400).json({ message: 'Company and position are required' });
    return;
  }

  const job = await JobApplication.create({
    userId: req.userId,
    company,
    position,
    location,
    salary,
    status: status || 'applied',
    notes,
    jobUrl,
  });

  res.json({ message: 'Job added successfully', job });
};

// Update job
export const updateJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { jobId, ...updateData } = req.body;

  const job = await JobApplication.findOneAndUpdate(
    { _id: jobId, userId: req.userId },
    updateData,
    { new: true }
  );

  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  res.json({ message: 'Job updated successfully', job });
};

// Delete job
export const deleteJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { jobId } = req.params;

  const job = await JobApplication.findOneAndDelete({
    _id: jobId,
    userId: req.userId,
  });

  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  res.json({ message: 'Job deleted successfully' });
};
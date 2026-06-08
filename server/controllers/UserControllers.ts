import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { AuthRequest } from '../types/index.js';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// Register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({ message: 'Please enter a valid email' });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'Email already registered. Please login.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(newUser._id.toString());
  const userObj = newUser.toObject() as unknown as Record<string, unknown>;
  delete userObj.password;

  res.status(201).json({
    message: 'Account created successfully!',
    token,
    user: userObj,
  });
};

// Login user
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: 'Invalid email or password' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user._id.toString());
  const userObj = user.toObject() as unknown as Record<string, unknown>;
  delete userObj.password;

  res.status(200).json({
    message: 'Login successful!',
    token,
    user: userObj,
  });
};

// Get user data
export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.userId).select('-password');

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ user });
};

// Get user resumes
export const getUserResumes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const resumes = await Resume.find({ userId: req.userId })
    .select('title template accent_color updatedAt createdAt')
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({ resumes });
};
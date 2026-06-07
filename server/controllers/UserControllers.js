import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // ✅ Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered. Please login.' })
    }

    // ✅ Create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        name, email, password: hashedPassword
    })

    // ✅ Return success
    const token = generateToken(newUser._id)
    newUser.password = undefined;

    return res.status(201).json({
        message: 'Account created successfully!',
        token,
        user: newUser
    })
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    // ✅ Check if password is correct
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    // ✅ Return success
    const token = generateToken(user._id)
    user.password = undefined;

    return res.status(200).json({
        message: 'Login successful!',
        token,
        user
    })
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    const userId = req.userId;

    // ✅ Check if user exists
    const user = await User.findById(userId).select('-password')
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ user })
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    const userId = req.userId;

    const resumes = await Resume.find({ userId })
        .select('title template accent_color updatedAt createdAt')
        .sort({ updatedAt: -1 })

    return res.status(200).json({ resumes })
}
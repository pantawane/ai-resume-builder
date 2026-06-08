import express from 'express';
import protect from '../middleware/authMiddleware.ts';
import {
  registerUser,
  loginUser,
  getUserById,
  getUserResumes,
} from '../controllers/UserControllers.ts';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);

export default userRouter;
import { Request } from 'express';

// ✅ Extended Request with userId
export interface AuthRequest extends Request {
  userId?: string;
}

// ✅ User types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// ✅ Resume types
export interface IPersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  image?: string;
}

export interface IExperience {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface IEducation {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

export interface IProject {
  name?: string;
  description?: string;
  link?: string;
}

export interface IResume {
  _id: string;
  userId: string;
  title: string;
  personal_info: IPersonalInfo;
  professional_summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  project: IProject[];
  template: string;
  accent_color: string;
  public: boolean;
}

// ✅ Job Application types
export interface IJobApplication {
  _id: string;
  userId: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  notes?: string;
  jobUrl?: string;
  appliedDate: Date;
}

// ✅ API Response types
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}
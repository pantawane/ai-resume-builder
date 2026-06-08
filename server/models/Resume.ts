import mongoose, { Document, Schema } from 'mongoose';

interface IPersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  image?: string;
  profession?: string;
}

interface IExperience {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface IEducation {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

interface IProject {
  name?: string;
  description?: string;
  link?: string;
}

export interface IResumeDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResumeDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    personal_info: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String,
      image: String,
      profession: String,
    },
    professional_summary: {
      type: String,
      default: '',
    },
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [String],
    project: [
      {
        name: String,
        description: String,
        link: String,
      },
    ],
    template: {
      type: String,
      default: 'classic',
    },
    accent_color: {
      type: String,
      default: '#3B82F6',
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IResumeDocument>('Resume', resumeSchema);
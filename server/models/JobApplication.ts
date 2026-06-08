import mongoose, { Document, Schema } from 'mongoose';

// ✅ TypeScript interface for the document
export interface IJobApplicationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: Date;
  notes: string;
  jobUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplicationDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    jobUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplicationDocument>(
  'JobApplication',
  jobApplicationSchema
);
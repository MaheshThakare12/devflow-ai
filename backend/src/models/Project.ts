import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId | IUser;
  members: mongoose.Types.ObjectId[] | IUser[];
  status: 'active' | 'archived';
  color: string;
  emoji?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    color: { type: String, default: '#6366f1' },
    emoji: { type: String }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

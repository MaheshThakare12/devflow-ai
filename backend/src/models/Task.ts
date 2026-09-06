import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface ITask extends Document {
  title: string;
  description?: string;
  project: mongoose.Types.ObjectId | IProject;
  assignee?: mongoose.Types.ObjectId | IUser;
  createdBy: mongoose.Types.ObjectId | IUser;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, minlength: 2, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    dueDate: { type: Date },
    tags: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 10 && val.every(t => t.length <= 30),
        'Maximum 10 tags, each max 30 chars'
      ]
    },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);

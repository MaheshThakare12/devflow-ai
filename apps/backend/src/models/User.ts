import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (!this.avatar) {
      const initials = this.name.substring(0, 2).toUpperCase();
      this.avatar = `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);

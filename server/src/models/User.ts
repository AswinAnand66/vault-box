import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ITrustedContact {
  email: string;
  unlockDelay: number;
  lastAccessAttempt: Date | null;
}

export interface IUser extends Document {
  email: string;
  password: string;
  trustedContact?: ITrustedContact;
  lastActive: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  trustedContact: {
    email: String,
    unlockDelay: {
      type: Number,
      default: 30
    },
    lastAccessAttempt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 